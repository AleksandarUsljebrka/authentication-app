using ServiceLayer.DTOs.Auth;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services.Interfaces
{
	public interface IAuthService
	{
		Task<IResult> CreateUser(RegisterDto userDto);
		Task<IResult> LoginUser(LoginDto loginDto);
		Task<IResult> GoogleLogin(GoogleLoginDto loginDto);
		Task<IResult> VerifyEmail(string token, string email);
		Task<IResult> Verify2FAToken(string token, string email);

	}
}
