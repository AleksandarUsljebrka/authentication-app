using Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Helpers.Token
{
    public class TokenHelper(IConfiguration _config, UserManager<User> _userManager) : ITokenHelper
    {
        public string GenerateToken(UserSessionDto user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var userClaims = new[]
            {
                new Claim("id", user.Id),
                new Claim("email", user.Email),
                new Claim("role", user.Role)
            };
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: userClaims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<User> UserByToken(string token)
		{
            string email = GetClaim(token, "email");

			var user = await _userManager.FindByEmailAsync(email);
			

			return user;
        }

        public string GetClaim(string tokenStr, string type)
        {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.ReadJwtToken(tokenStr);

            string claim = token.Claims.Where(c => c.Type == type).FirstOrDefault().Value;

            return claim;
        }
    }
}
