using Microsoft.Extensions.DependencyInjection;
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
using ServiceLayer.Helpers.Image;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ServiceLayer.Helpers.Email;

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
			.AddSignInManager()
			.AddDefaultTokenProviders();


			var mapperConfig = new MapperConfiguration(mc =>
			{
				mc.AddProfile(new MappingProfile());
			});
			IMapper mapper = mapperConfig.CreateMapper();
			services.AddSingleton(mapper);


			services.AddScoped<IAuthService, AuthService>();
			services.AddScoped<IUserService, UserService>();
			services.AddScoped<IAdminService, AdminService>();
			services.AddScoped<ITokenHelper, TokenHelper>();
			services.AddScoped<IImageHelper, ImageHelper>();
			services.AddScoped<IEmailSender, EmailSender>();
			services.AddAuthentication(opt =>
			{
				opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
				opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			})
		 .AddJwtBearer(options =>
		 {
			 options.TokenValidationParameters = new TokenValidationParameters
			 {
				 ValidateIssuer = true,
				 ValidateAudience = false,
				 ValidateLifetime = true,
				 ValidateIssuerSigningKey = true,
				 ValidIssuer = configuration["Jwt:Issuer"],
				 IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),

			 };
		 });

			return services;
		}
	}
}
