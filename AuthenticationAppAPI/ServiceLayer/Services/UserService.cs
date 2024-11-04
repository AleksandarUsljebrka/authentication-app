using AutoMapper;
using ServiceLayer.DTOs.Image;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Helpers.Image;
using ServiceLayer.Helpers.Token;
using ServiceLayer.Services.Interfaces;


namespace ServiceLayer.Services
{
	public class UserService(ITokenHelper _tokenHelper, IMapper _mapper, IImageHelper _imageHelper) : IUserService
	{
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

		public async Task<IResult> GetUserProfile(string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");
			
			var userDto = _mapper.Map<UserProfileDto>(user);

			return new Result(true, userDto);
		}
	
		public async Task<IResult> UpdateProfileImage(FormFileImageDto formFileDto, string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");

			var uploadImageSuccess = await _imageHelper.UploadProfileImage(user, formFileDto.Image);
			if (!uploadImageSuccess) return new Result(false, ErrorCode.BadRequest,"Could not upload image");

			return new Result(true);
		}
	}
}
