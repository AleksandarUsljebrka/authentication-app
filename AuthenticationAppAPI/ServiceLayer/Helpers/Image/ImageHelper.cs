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
    public class ImageHelper(UserManager<User> userManager):IImageHelper
    {
		private const string userRelativePath = "../ProfileImages";
		public async Task<byte[]> GetProfileImage(string image)
        {
            if (image == null) return null;

            var imagePath = Path.Combine(userRelativePath, image);
            if(!File.Exists(imagePath)) 
            {
                return null;
            }

            byte[] imageResult = File.ReadAllBytes(imagePath);
            return imageResult;
        }
        public async Task<bool> UploadProfileImage(User user, IFormFile newImage)
        {
            if(newImage is null) return false;

            if(user.ProfileImage!= null)
            {
                var imagePath = Path.Combine(userRelativePath, user.ProfileImage);
                if(File.Exists(imagePath))
                    File.Delete(imagePath);
            }

            string directory = Path.Combine(Directory.GetCurrentDirectory() + userRelativePath);
            if(!Directory.Exists(directory))
                Directory.CreateDirectory(directory);


            string extension = Path.GetExtension(newImage.FileName);
            string imageFileName = Path.Combine(directory, user.ProfileImage)+extension;
			using (FileStream fs = new FileStream(imageFileName, FileMode.Create))
			{
				newImage.CopyTo(fs);
			}

			user.ProfileImage = user.Email + extension;

            var updateUser = await userManager.UpdateAsync(user);
            if (!updateUser.Succeeded) return false;

            return true;
		}
    }
}
