using AutoMapper;
using Data.Models;
using Microsoft.AspNetCore.Identity;
using ServiceLayer.DTOs.Image;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Helpers.Image;
using ServiceLayer.Helpers.Token;
using ServiceLayer.Services.Interfaces;


namespace ServiceLayer.Services
{
	public class UserService(ITokenHelper _tokenHelper, IMapper _mapper, IImageHelper _imageHelper, UserManager<User> _userManager) : IUserService
	{

		public async Task<IResult> GetUserProfile(string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");
			
			var userDto = _mapper.Map<UserProfileDto>(user);

			return new Result(true, userDto);
		}
		public async Task<IResult> UpdateUser(string token, UserProfileDto userDto)
		{
			if (userDto is null) return new Result(false, ErrorCode.BadRequest);

			var user = await _tokenHelper.UserByToken(token);
			if(user is null) return new Result(false, ErrorCode.NotFound);

			user.FirstName = userDto.FirstName;
			user.LastName = userDto.LastName;
			user.DateOfBirth = userDto.DateOfBirth;

			var updatedUser = await _userManager.UpdateAsync(user);
			if(!updatedUser.Succeeded) return new Result(false);

			var userResponseDto = _mapper.Map<UserProfileDto>(user);

			return new Result(true, userResponseDto);

		}
		public async Task<IResult> GetProfileImage(string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");

			if (user.ProfileImage == null) return new Result(true);

			byte[] image = await _imageHelper.GetProfileImage(user.ProfileImage);
			if (image == null)
			{
				return new Result(true);
			}

			GetImageDto getImageDto = new GetImageDto() { Image = image };
			
			return new Result(true, getImageDto);

		}
		public async Task<IResult> UpdateProfileImage(FormFileImageDto formFileDto, string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");

			var uploadImageSuccess = await _imageHelper.UploadProfileImage(user, formFileDto.Image, _userManager);
			if (!uploadImageSuccess) return new Result(false, ErrorCode.BadRequest,"Could not upload image");

			return new Result(true);
		}
		public async Task<IResult> UpdatePassword(PasswordDto passwordDto, string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");

			if (passwordDto.OldPassword.Equals(passwordDto.NewPassword)) return new Result(true);

			var oldPasswordCheck = await _userManager.CheckPasswordAsync(user, passwordDto.OldPassword);
			if(!oldPasswordCheck) return new Result(false, ErrorCode.Unauthorized, "Old password is incorrect");

			var newPasswordCheck = await _userManager.ChangePasswordAsync(user, passwordDto.OldPassword, passwordDto.NewPassword);
			if(!newPasswordCheck.Succeeded) return new Result(false, ErrorCode.BadRequest, "Could not change password");

			return new Result(true);
		}
	}
}
