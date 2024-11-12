using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ServiceLayer.DTOs;
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
		public async Task<IActionResult> GetAllUsers([FromQuery]PaginationDto paginationDto, [FromQuery]string isVerified)
		{
			try
			{
				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				var result = await _adminService.GetAllUsers(token, isVerified, paginationDto);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);

				var users = result.UserListDto.Users;
				var count = result.UserTotalCount;
				return Ok(new {users, count});
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
		public async Task<IActionResult> FilterUsers([FromBody]UserFilter userFilter)
		{
			try
			{
				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				
				var result = await _adminService.FilterUsersByDate(userFilter, token);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);

				return Ok(result.Dto);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}

		[HttpGet("search")]
		[Authorize(Roles = "Admin")]
		public async Task<IActionResult> SearchByEmail([FromQuery]string email, [FromQuery]string isVerified)
		{
			try
			{
				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();

				var result = await _adminService.SearchUserByEmail(email,isVerified, token);

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
