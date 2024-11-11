using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ServiceLayer.DTOs.Auth;
using ServiceLayer.DTOs.User;
using ServiceLayer.Services;
using ServiceLayer.Services.Interfaces;

namespace AuthenticationAppAPI.Controllers
{
	[ApiController]
	[Route("auth")]
	public class AuthController(IAuthService _authService) : Controller
	{
		[HttpPost]
		[Route("register")]
		public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
		{
			var response = await _authService.CreateUser(registerDto);

			if (!response.Successful) return StatusCode((int)response.ErrorCode, response.ErrorMess);

			return Ok();
		}
		[HttpPost]
		[Route("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
		{
			var response = await _authService.LoginUser(loginDto);

			if (!response.Successful) return StatusCode((int)response.ErrorCode, response.ErrorMess);
			if (response.Successful && !response.ErrorMess.IsNullOrEmpty()) return Ok(response.ErrorMess);

			return Ok(response.Token);
		}

		[HttpPost("google-login")]
		public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto idToken)
		{
			var result = await _authService.GoogleLogin(idToken);

			try
			{
				if (!result.Successful)
				{
					return StatusCode((int)result.ErrorCode, result.ErrorMess);
				}
				else
					return Ok(result.Token);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);

			}
		}

		[HttpPost("verify-email")]
		public async Task<IActionResult> VerifyEmail([FromBody]VerifyEmailDto verifyEmailDto)
		{
			var result = await _authService.VerifyEmail(verifyEmailDto.Token, verifyEmailDto.Email);

			try
			{
				if (!result.Successful)
				{
					return StatusCode((int)result.ErrorCode, result.ErrorMess);
				}
				else
					return Ok();
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);

			}
		}
	}

	
}
