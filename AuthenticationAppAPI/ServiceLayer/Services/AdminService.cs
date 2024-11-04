using AutoMapper;
using Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Services.Interfaces;

namespace ServiceLayer.Services
{
	public class AdminService:IAdminService
	{
		private readonly UserManager<User> _userManager;
		private readonly IMapper _mapper;
		public AdminService(UserManager<User> userManager, IMapper mapper)
		{
			_mapper = mapper;
			_userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
		}
		public async Task<IResult> GetAllUsers()
		{
			var users = await _userManager.GetUsersInRoleAsync("User");
			var usersDto = new UserListDto()
			{
				Users = _mapper.Map<List<UserProfileDto>>(users)
			};

			return new Result(true, usersDto);
		}
	}
}
