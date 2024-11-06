using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ServiceLayer.DTOs.Image;
using ServiceLayer.DTOs.User;
using ServiceLayer.Services.Interfaces;

namespace AuthenticationAppAPI.Controllers
{
	[ApiController]
	[Authorize]
	[Route("user")]
	public class UserController(IUserService _userService) : Controller
	{
		[HttpGet]
		[Route("my-profile")]
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

		[HttpPut("my-profile")]
		public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto userProfileDto)
		{
			try
			{

				var token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				var result = await _userService.UpdateUser(token, userProfileDto);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);

				return Ok(result.Dto);
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}

		[HttpGet("profile-image")]
		public async Task<IActionResult> GetProfileImage()
		{
			try
			{
				string token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();


				var result = await _userService.GetProfileImage(token);

				if (!result.Successful) return StatusCode((int)result.ErrorCode, result.ErrorMess);
				if (result.Successful && !result.ErrorMess.IsNullOrEmpty()) return Ok(result.ErrorMess);
				return Ok(result.Dto);
			}
			catch (Exception)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}
		[HttpPut("profile-image")]

		public async Task<IActionResult> UpdateProfileImage([FromForm] FormFileImageDto profilImage)
		{
			try
			{

				string token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();


				var result = await _userService.UpdateProfileImage(profilImage, token);

				if (!result.Successful)
				{
					return StatusCode((int)result.ErrorCode, result.ErrorMess);
				}

				return Ok();
			}
			catch (Exception e)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);

			}
		}

		[HttpPut("password")]
		[Authorize]
		public async Task<IActionResult>UpdatePassword(PasswordDto passwordDto)
		{
			try
			{
				string token = Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").LastOrDefault();
				var result = await _userService.UpdatePassword(passwordDto, token);

				if (!result.Successful)
					return StatusCode((int)result.ErrorCode, result.ErrorMess);

				return Ok();
			}
			catch (Exception e)
			{
				return StatusCode(StatusCodes.Status500InternalServerError);
			}
		}
	}
}
