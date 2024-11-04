﻿using Data.Models;
using Microsoft.AspNetCore.Identity;
using ServiceLayer.DTOs.Auth;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Helpers.Token;
using ServiceLayer.Services.Interfaces;

namespace ServiceLayer.Services
{
	public class AuthService(UserManager<User> _userManager, ITokenHelper _tokenHelper):IAuthService
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

		public async Task<IResult> LoginUser(LoginDto loginDto)
		{
			if (loginDto is null) return new Result(false, ErrorCode.InternalServerError, "Model is empty!");

			var user = await _userManager.FindByEmailAsync(loginDto.Email);
			if (user is null) return new Result(false, ErrorCode.Conflict, "User doesn't exists");

			bool checkPassword = await _userManager.CheckPasswordAsync(user, loginDto.Password);
			if (!checkPassword) return new Result(false, ErrorCode.BadRequest, "Password incorrect!");

			var userSession = new UserSessionDto(user.Id, user.Email);
			string token = _tokenHelper.GenerateToken(userSession);
			return new Result(true, token!);
		}
	}
}
