using AutoMapper;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Helpers.Token;
using ServiceLayer.Services.Interfaces;


namespace ServiceLayer.Services
{
	public class UserService(ITokenHelper _tokenHelper, IMapper _mapper) : IUserService
	{
		public async Task<IResult> GetUserProfile(string token)
		{
			var user = await _tokenHelper.UserByToken(token);
			if (user == null) return new Result(false, ErrorCode.NotFound, "No user found");
			
			var userDto = _mapper.Map<UserProfileDto>(user);

			return new Result(true, userDto);
		}
	}
}
