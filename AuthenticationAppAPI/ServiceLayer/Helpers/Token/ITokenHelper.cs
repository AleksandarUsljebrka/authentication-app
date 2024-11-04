using Data.Models;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Helpers.Token
{
	public interface ITokenHelper
	{
		string GetClaim(string tokenStr, string type);
		Task<User> UserByToken(string token);
		string GenerateToken(UserSessionDto user);


	}
}
