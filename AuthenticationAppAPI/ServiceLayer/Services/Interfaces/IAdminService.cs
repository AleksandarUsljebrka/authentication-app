using ServiceLayer.DTOs;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services.Interfaces
{
	public interface IAdminService
	{
		public Task<IResult> GetAllUsers(string token,string isVerified, PaginationDto paginationDto);
		public Task<IResult> DeleteUser(string userId, string token);
		public Task<IResult> FilterUsersByDate(UserFilter userFilter, string token);
		Task<IResult> SearchUserByEmail(string email,string isVerified, string token);
	}
}
