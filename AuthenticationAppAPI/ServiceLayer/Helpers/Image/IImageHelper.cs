using Data.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Helpers.Image
{
	public interface IImageHelper
	{
		Task<byte[]> GetProfileImage(string image);
		Task<bool> UploadProfileImage(User user, IFormFile newImage, UserManager<User> _userManager);

	}
}
