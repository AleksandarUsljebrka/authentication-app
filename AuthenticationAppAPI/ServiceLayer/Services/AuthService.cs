using Data.Models;
using Microsoft.AspNetCore.Identity;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Services.Interfaces;

namespace ServiceLayer.Services
{
	public class AuthService(UserManager<User> _userManager):IAuthService
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
				IsVerified = false
			};

			var user = await _userManager.FindByEmailAsync(newUser.Email);
			if (user is not null) return new Result(false, ErrorCode.Conflict, "User already exists!");

			var createUser = await _userManager.CreateAsync(newUser!, userDto.Password!);
			if (!createUser.Succeeded) return new Result(false, ErrorCode.InternalServerError, "Error during creating account!");

			var createRole = await _userManager.AddToRoleAsync(newUser, "User");

			return new Result(true);

		}
	}
}
