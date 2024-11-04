﻿using Microsoft.Extensions.DependencyInjection;
using Data.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ServiceLayer.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Data.Models;
using ServiceLayer.Services;
using ServiceLayer.Helpers.Token;
using AutoMapper;
using ServiceLayer.Mapping;

namespace ServiceLayer.Helpers.Extensions
{
	public static class ServiceExtensions
	{
		public static IServiceCollection AddCustomServices(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<ApplicationDbContext>(options =>
			{
				options.UseSqlServer(configuration.GetConnectionString("local"));
			});
			services.AddIdentity<User, IdentityRole>(
			options =>
			{
				options.Password.RequiredUniqueChars = 0;
				options.Password.RequireNonAlphanumeric = false;
				options.Password.RequiredLength = 6;
				options.Password.RequireUppercase = false;
				options.Password.RequireLowercase = false;
				options.Password.RequireDigit = false;
			}
			)
			.AddEntityFrameworkStores<ApplicationDbContext>()
			.AddSignInManager();


			var mapperConfig = new MapperConfiguration(mc =>
			{
				mc.AddProfile(new MappingProfile());
			});
			IMapper mapper = mapperConfig.CreateMapper();
			services.AddSingleton(mapper);


			services.AddScoped<IAuthService, AuthService>();
			services.AddScoped<IUserService, UserService>();
			services.AddScoped<ITokenHelper, TokenHelper>();



			return services;
		}
	}
}
