using ServiceLayer.DTOs.Image;
using ServiceLayer.DTOs.Result;
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
		Task<IResult> GetProfileImage(string token);
		Task<IResult> UpdateProfileImage(FormFileImageDto formFile, string token);
	}
}
