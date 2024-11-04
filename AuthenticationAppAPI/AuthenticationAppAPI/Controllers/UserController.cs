using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer.Services.Interfaces;

namespace AuthenticationAppAPI.Controllers
{
	[ApiController]
	[Authorize]
	[Route("user")]
	public class UserController(IUserService _userService) : Controller
	{
		[HttpGet]
		[Route("myProfile")]
		public async Task<IActionResult> GetProfile()
		{
			try
			{

				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				var result = await _userService.GetUserProfile(token);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);

				return Ok(result.Dto);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}
	}
}
