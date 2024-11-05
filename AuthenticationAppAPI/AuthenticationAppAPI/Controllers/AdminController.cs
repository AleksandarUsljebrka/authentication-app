using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer.DTOs.User;
using ServiceLayer.Services;
using ServiceLayer.Services.Interfaces;

namespace AuthenticationAppAPI.Controllers
{
	[ApiController]
	[Authorize(Roles ="Admin")]
	[Route("admin")]
	public class AdminController(IAdminService _adminService) : Controller
	{
		[HttpGet("all-users")]
		public async Task<IActionResult>GetAllUsers()
		{
			try
			{
				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				var result = await _adminService.GetAllUsers(token);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);

				return Ok(result.Dto);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}
		[HttpDelete("delete-user")]
		public async Task<IActionResult> DeleteUser([FromQuery] string id) 
		{
			try
			{
				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				var result = await _adminService.DeleteUser(id, token);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);

				return Ok(result.Dto);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}

		[HttpPost("filter")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> FilterUsers(UserFilter userFilter)
		{
			try
			{
				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				
				var result = await _adminService.FilterUsers(userFilter, token);

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
