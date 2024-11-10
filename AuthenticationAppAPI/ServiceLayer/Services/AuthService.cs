using Data.Models;
using Microsoft.AspNetCore.Identity;
using ServiceLayer.DTOs.Auth;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Helpers.Token;
using ServiceLayer.Services.Interfaces;
using Google.Apis.Auth;
using FluentEmail.Core.Models;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.Extensions.Configuration;


namespace ServiceLayer.Services
{
	public class AuthService(IHttpClientFactory _httpClientFactory,IConfiguration configuration, UserManager<User> _userManager, ITokenHelper _tokenHelper):IAuthService
	{
		public async Task<IResult> CreateUser(RegisterDto userDto)
		{
			if (userDto is null) return new Result(false, ErrorCode.BadRequest, "Model is empty!");

			var newUser = new User()
			{

				FirstName = userDto.FirstName,
				UserName = userDto.Email,
				LastName = userDto.LastName,
				Email = userDto.Email,
				DateOfBirth = userDto.DateOfBirth.Date,
				IsVerified = false,
				IsDeleted = false
			};

			var user = await _userManager.FindByEmailAsync(newUser.Email);
			if (user is not null) return new Result(false, ErrorCode.Conflict, "User already exists!");

			var createUser = await _userManager.CreateAsync(newUser!, userDto.Password!);
			if (!createUser.Succeeded) return new Result(false, ErrorCode.InternalServerError, "Error during creating account!");

			var createRole = await _userManager.AddToRoleAsync(newUser, "User");

			return new Result(true);

		}

		public async Task<IResult> LoginUser(LoginDto loginDto)
		{
			if (loginDto is null) return new Result(false, ErrorCode.InternalServerError, "Model is empty!");

			var user = await _userManager.FindByEmailAsync(loginDto.Email);
			if (user is null) return new Result(false, ErrorCode.Conflict, "User doesn't exists");

			if(user.IsDeleted) return new Result(true, "DELETED");

			if(user.IsGoogleLogin && user.PasswordHash.IsNullOrEmpty()) return new Result(false, ErrorCode.BadRequest, "Password incorrect!You're registered by google!");

			bool checkPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);
			if (!checkPassword) return new Result(false, ErrorCode.BadRequest, "Password incorrect!");

			//it returns a list of roles
			var userRoles = await _userManager.GetRolesAsync(user);
			if (!userRoles.Any()) return new Result(false, ErrorCode.NotFound, "No roles found");

			//I'll take first one because I assume that user have only one role
			var userSession = new UserSessionDto(user.Id, user.Email, userRoles.First(), user.IsGoogleLogin);
			string token = _tokenHelper.GenerateToken(userSession);
			return new Result(true, token!);
		}

		public async Task<IResult> GoogleLogin(GoogleLoginDto googleLoginDto)
		{
			var code = googleLoginDto.Code;

			if (string.IsNullOrEmpty(code))
			{
				return new Result(false,ErrorCode.BadRequest, "Code is required.");
			}

			var clientId = configuration["GoogleLogin:ClientId"];
			var clientSecret = configuration["GoogleLogin:ClientSecret"];
			var redirectUri = configuration["GoogleLogin:RedirectUri"];

			var httpClient = _httpClientFactory.CreateClient();
			var requestBody = new FormUrlEncodedContent(new[]
			{
				new KeyValuePair<string, string>("code", code),
				new KeyValuePair<string, string>("client_id", clientId),
				new KeyValuePair<string, string>("client_secret", clientSecret),
				new KeyValuePair<string, string>("redirect_uri", redirectUri),
				new KeyValuePair<string, string>("grant_type", "authorization_code")
			});

			var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", requestBody);

			if (!response.IsSuccessStatusCode)
			{
				return new Result(false, ErrorCode.InternalServerError, "Failed to exchange code for access token.");
			}

			var responseContent = await response.Content.ReadAsStringAsync();
			var tokenData = JsonSerializer.Deserialize<JsonElement>(responseContent);


			var idToken = tokenData.GetProperty("id_token").GetString();

			GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(idToken).Result;

			//if there is no user, create one with no password
			var user = await _userManager.FindByEmailAsync(payload.Email);
			if (user == null)
			{		
				User newUser = new User()
				{
					FirstName = !payload.Name.IsNullOrEmpty()? payload.Name:null,
					LastName = !payload.FamilyName.IsNullOrEmpty() ? payload.FamilyName : null,
					Email = payload.Email,
					UserName = payload.Email,
					IsGoogleLogin = true,
					IsVerified = false,
					IsDeleted = false
				};

				var createUser = await _userManager.CreateAsync(newUser!);
				if (!createUser.Succeeded) return new Result(false, ErrorCode.InternalServerError, "Error during creating account!");

				var createRole = await _userManager.AddToRoleAsync(newUser, "User");
			}
			//after creating get that user from db and check him
			user = await _userManager.FindByEmailAsync(payload.Email);
			if (user is null) return new Result(false, ErrorCode.NotFound, "No user found");

			if (user.IsDeleted) return new Result(true, "DELETED");

			//check if there is roles in db
			var userRoles = await _userManager.GetRolesAsync(user);
			if (!userRoles.Any()) return new Result(false, ErrorCode.NotFound, "No roles found");

			//taking first user role because he's gonna have one role
			var userSession = new UserSessionDto(user.Id, user.Email, userRoles.First(), user.IsGoogleLogin);

			string token = _tokenHelper.GenerateToken(userSession);
			return new Result(true, token!);
		}

		
	}
}
