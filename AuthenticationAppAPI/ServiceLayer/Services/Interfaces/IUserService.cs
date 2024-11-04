using ServiceLayer.DTOs.Image;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services.Interfaces
{
	public  interface IUserService
	{
		Task<IResult> GetUserProfile(string token);
		Task<IResult> UpdateUser(string token, UserProfileDto userDto);
		Task<IResult> GetProfileImage(string token);
		Task<IResult> UpdateProfileImage(FormFileImageDto formFile, string token);
		Task<IResult> UpdatePassword(PasswordDto passwordDto, string token);
	}
}
