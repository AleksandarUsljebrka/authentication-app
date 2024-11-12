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
using AutoMapper;
using Microsoft.AspNetCore.WebUtilities;
using ServiceLayer.Helpers.Email;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using Org.BouncyCastle.Bcpg.OpenPgp;


namespace ServiceLayer.Services
{
	public class AuthService : IAuthService
	{
		private readonly ITokenHelper _tokenHelper;
		private readonly IMapper _mapper;
		private readonly IEmailSender _emailSender;
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly IConfiguration _configuration;
		private readonly UserManager<User> _userManager;
		public AuthService(IEmailSender _emailSender, IHttpClientFactory _httpClientFactory, IConfiguration _configuration, UserManager<User> _userManager, ITokenHelper _tokenHelper)
		{
			this._emailSender = _emailSender;
			this._httpClientFactory = _httpClientFactory;
			this._configuration = _configuration;
			this._userManager = _userManager;
			this._tokenHelper = _tokenHelper;
		}

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

			var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);

			var verificationLink = $"{_configuration["AppSettings:FrontendUrl"]}/verify-email?token={token}&email={newUser.Email}";

			// Send email with verification link
			var subject = "Please verify your email address";
			var message = $"Please click the following link to verify your email: <a href=\"{verificationLink}\">Verify Email</a>";

			_emailSender.SendEmail(message, newUser.Email, "Approval message");

			await _userManager.AddToRoleAsync(newUser, "User");

			return new Result(true);

		}

		public async Task<IResult> LoginUser(LoginDto loginDto)
		{
			if (loginDto is null) return new Result(false, ErrorCode.InternalServerError, "Model is empty!");

			var user = await _userManager.FindByEmailAsync(loginDto.Email);
			if (user is null) return new Result(false, ErrorCode.Conflict, "User doesn't exists");

			if (user.IsDeleted) return new Result(true, "DELETED");

			if (user.IsGoogleLogin && user.PasswordHash.IsNullOrEmpty()) return new Result(false, ErrorCode.BadRequest, "Password incorrect!You're registered by google!");

			if (!await _userManager.CheckPasswordAsync(user, loginDto.Password)) return new Result(false, ErrorCode.BadRequest, "Password incorrect!");

			if (!user.EmailConfirmed) return new Result(true, "NOT_VERIFIED");

			if (user.TwoFactorEnabled)
			{
				var token2FA = await _userManager.GenerateTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider);

				var emailSubject = "Your 2FA Token";
				var emailBody = $"Your 2FA token is {token2FA}";

				_emailSender.SendEmail(emailBody, user.Email, emailSubject);
				return new Result(true, "2FA");
			}

			return await CompleteLoginHelper(user);
			
		}

		public async Task<IResult> GoogleLogin(GoogleLoginDto googleLoginDto)
		{
			var code = googleLoginDto.Code;

			if (string.IsNullOrEmpty(code))
			{
				return new Result(false, ErrorCode.BadRequest, "Code is required.");
			}

			var clientId = _configuration["GoogleLogin:ClientId"];
			var clientSecret = _configuration["GoogleLogin:ClientSecret"];
			var redirectUri = _configuration["GoogleLogin:RedirectUri"];

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
					FirstName = !payload.Name.IsNullOrEmpty() ? payload.Name : null,
					LastName = !payload.FamilyName.IsNullOrEmpty() ? payload.FamilyName : null,
					Email = payload.Email,
					UserName = payload.Email,
					IsGoogleLogin = true,
					IsVerified = false,
					IsDeleted = false,
					EmailConfirmed = true,

				};

				var createUser = await _userManager.CreateAsync(newUser!);
				if (!createUser.Succeeded) return new Result(false, ErrorCode.InternalServerError, "Error during creating account!");

				await _userManager.AddToRoleAsync(newUser, "User");
			}
			//after creating get that user from db and check him
			user = await _userManager.FindByEmailAsync(payload.Email);
			if (user is null) return new Result(false, ErrorCode.NotFound, "No user found");

			if (user.IsDeleted) return new Result(true, "DELETED");
			if (!user.IsGoogleLogin) return new Result(true, "NOT_GOOGLE");

			//check if there is roles in db
			var userRoles = await _userManager.GetRolesAsync(user);
			if (!userRoles.Any()) return new Result(false, ErrorCode.NotFound, "No roles found");

			//taking first user role because he's gonna have one role
			var userSession = new UserSessionDto(user.Id, user.Email, userRoles.First(), user.IsGoogleLogin);

			string token = _tokenHelper.GenerateToken(userSession);
			return new Result(true, token!);
		}


		public async Task<IResult> VerifyEmail(string token, string email)
		{
			var decodedToken = HttpUtility.UrlDecode(token);
			decodedToken = decodedToken.Replace(" ", "+");

			var decodedEmail = HttpUtility.UrlDecode(email);

			var user = await _userManager.FindByEmailAsync(decodedEmail);
			if (user == null)
			{
				return new Result(false, "Invalid email address.");
			}

			var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
			if (result.Succeeded)
			{
				user.EmailConfirmed = true;
				await _userManager.UpdateAsync(user);
				return new Result(true);
			}

			return new Result(false, "Error while verifying email.");
		}

		public async Task<IResult> Verify2FAToken(string token, string email)
		{
			var user = await _userManager.FindByEmailAsync(email);
			if (user == null || !user.TwoFactorEnabled)
			{
				return new Result(false, "User not found or 2FA not enabled.");
			}

			var isTokenValid = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultEmailProvider, token);

			if (isTokenValid)
			{
				return await CompleteLoginHelper(user);
			}

			return new Result(false, "Invalid 2FA token.");
		}

		private async Task<IResult> CompleteLoginHelper(User user)
		{
			var userRoles = await _userManager.GetRolesAsync(user);
			if (!userRoles.Any()) return new Result(false, ErrorCode.NotFound, "No roles found");

			//I'll take first one because I assume that user have only one role
			var userSession = new UserSessionDto(user.Id, user.Email, userRoles.First(), user.IsGoogleLogin);
			string token = _tokenHelper.GenerateToken(userSession);
			return new Result(true, token!);
		}
	}
}
