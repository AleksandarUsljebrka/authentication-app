using AutoMapper;
using Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg.OpenPgp;
using ServiceLayer.DTOs;
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
		public async Task<IResult> GetAllUsers(string token,string isVerified, PaginationDto paginationDto)
		{
			var admin = await _tokenHelper.UserByToken(token);
			if (admin is null) return new Result(false, ErrorCode.NotFound, "Admin not found");

			var role = await _roleManager.FindByNameAsync("User");
			if (role is null) return new Result(false, ErrorCode.NotFound, "Role \"User\" does not exist");

			var users = await _userManager.GetUsersInRoleAsync(role.Name);
			var filteredUsers = users.Where(u => !u.IsDeleted).ToList();


			if (isVerified == "verified")
				filteredUsers = filteredUsers.Where(u => u.EmailConfirmed).ToList();
			else if (isVerified == "unverified")
				filteredUsers = filteredUsers.Where(u => !u.EmailConfirmed).ToList();

			var totalUsers = filteredUsers.Count();

			var paginatedUsers = filteredUsers
				.Skip((paginationDto.PageNumber - 1) * paginationDto.PageSize)
				.Take(paginationDto.PageSize)
				.ToList();

			var usersDto = new UserListDto()
			{
				Users = _mapper.Map<List<UserProfileDto>>(paginatedUsers)
			};

			return new Result(true, usersDto, totalUsers);
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
		
		public async Task<IResult> FilterUsersByDate(UserFilter userFilter, string token)
		{
			var admin = await _tokenHelper.UserByToken(token);
			if (admin is null) return new Result(false, ErrorCode.NotFound, "Admin not found");


			var role = await _roleManager.FindByNameAsync("User");
			if (role is null) return new Result(false, ErrorCode.NotFound, "Role \"User\" does not exist");

			var usersQuery = _userManager.Users
				.Where(u => !u.IsDeleted);


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

			if (userFilter.IsVerified == "verified")
				usersQuery = usersQuery.Where(u => u.EmailConfirmed);
			else if(userFilter.IsVerified == "unverified")
				usersQuery = usersQuery.Where(u => !u.EmailConfirmed);

			var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
			var userInRoleIds = usersInRole.Select(u => u.Id).ToList();

			usersQuery = usersQuery.Where(u => userInRoleIds.Contains(u.Id));

			var users = await usersQuery.ToListAsync();

			var usersDto = new UserListDto()
			{
				Users = _mapper.Map<List<UserProfileDto>>(users),
			};

			return new Result(true, usersDto);
		}

		public async Task<IResult> SearchUserByEmail(string email,string isVerified, string token)
		{
			var admin = await _tokenHelper.UserByToken(token);
			if (admin is null) return new Result(false, ErrorCode.NotFound, "Admin not found");

			if (string.IsNullOrEmpty(email)) return new Result(false, ErrorCode.BadRequest, "Email address is missing");

			var role = await _roleManager.FindByNameAsync("User");
			if (role is null) return new Result(false, ErrorCode.NotFound, "Role \"User\" does not exist");

			User user;
			if(isVerified =="verified")
				user = _userManager.Users.Where(u => u.Email == email && !u.IsDeleted && u.EmailConfirmed).FirstOrDefault();
			else if(isVerified == "unverified")
				user = _userManager.Users.Where(u => u.Email == email && !u.IsDeleted && !u.EmailConfirmed).FirstOrDefault();
			else
				user = _userManager.Users.Where(u => u.Email == email && !u.IsDeleted).FirstOrDefault();

			var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
			
			if (!usersInRole.Contains(user)) return new Result(false, ErrorCode.NotFound, "User not found");

			


			var userDto = _mapper.Map<UserProfileDto>(user);

			return new Result(true, userDto);
		}
	}
}
