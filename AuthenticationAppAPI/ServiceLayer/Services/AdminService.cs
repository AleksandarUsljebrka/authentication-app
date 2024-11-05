using AutoMapper;
using Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using ServiceLayer.Helpers.Token;
using ServiceLayer.Services.Interfaces;

namespace ServiceLayer.Services
{
	public class AdminService:IAdminService
	{
		private readonly UserManager<User> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;

		private readonly IMapper _mapper;
		private readonly ITokenHelper _tokenHelper;
		public AdminService(UserManager<User> userManager, IMapper mapper, ITokenHelper tokenHelper, RoleManager<IdentityRole> roleManager)
		{
			_mapper = mapper;
			_tokenHelper = tokenHelper;
			_userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
			_roleManager = roleManager;
		}
		public async Task<IResult> GetAllUsers(string token)
		{
			var admin = await _tokenHelper.UserByToken(token);
			if (admin is null) return new Result(false, ErrorCode.NotFound, "Admin not found");

			var role = await _roleManager.FindByNameAsync("User");
			if (role is null) return new Result(false, ErrorCode.NotFound, "Role \"User\" does not exist");

			var users = await _userManager.GetUsersInRoleAsync(role.Name);
			var filteredUsers = users.Where(u => !u.IsDeleted).ToList();

			var usersDto = new UserListDto()
			{
				Users = _mapper.Map<List<UserProfileDto>>(filteredUsers)
			};

			return new Result(true, usersDto);
		}
		public async Task<IResult> DeleteUser(string userId, string token)
		{
			var admin = await _tokenHelper.UserByToken(token);
			if (admin is null) return new Result(false, ErrorCode.NotFound, "Admin not found");

			var user = await _userManager.FindByIdAsync(userId);
			if(user is null) return new Result(false, ErrorCode.NotFound, "User not found");

			user.IsDeleted = true;

			var userUpdated = await _userManager.UpdateAsync(user);
			if (!userUpdated.Succeeded) return new Result(false, ErrorCode.InternalServerError, "Error during updating");

			return new Result(true);
		}
		
		public async Task<IResult> FilterUsers(UserFilter userFilter, string token)
		{
			var admin = await _tokenHelper.UserByToken(token);
			if (admin is null) return new Result(false, ErrorCode.NotFound, "Admin not found");

			var usersQuery = _userManager.Users.Where(u => !u.IsDeleted);

			if (!string.IsNullOrEmpty(userFilter.Email)) 
				usersQuery = _userManager.Users.Where(u => u.Email == userFilter.Email);
			if (userFilter.StartDate.HasValue && userFilter.EndDate.HasValue)
			{
				usersQuery = usersQuery.Where(u => u.DateOfBirth >= userFilter.StartDate.Value && u.DateOfBirth <= userFilter.EndDate.Value);
			}
			else if (userFilter.StartDate.HasValue)
			{
				usersQuery = usersQuery.Where(u => u.DateOfBirth >= userFilter.StartDate.Value);
			}
			else if (userFilter.EndDate.HasValue)
			{
				usersQuery = usersQuery.Where(u => u.DateOfBirth <= userFilter.EndDate.Value);
			}

			var users = await usersQuery.ToListAsync();

			var usersDto = new UserListDto()
			{
				Users = _mapper.Map<List<UserProfileDto>>(users),
			};

			return new Result(true, usersDto);
		}
	}
}
