using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ServiceLayer.DTOs.Auth;
using ServiceLayer.DTOs.User;
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
			if(response.Successful && !response.ErrorMess.IsNullOrEmpty()) return Ok(response.ErrorMess);
			
			return Ok(response.Token);
		}
	}
}
