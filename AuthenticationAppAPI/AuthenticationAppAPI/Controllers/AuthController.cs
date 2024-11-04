using Microsoft.AspNetCore.Mvc;
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
	}
}
