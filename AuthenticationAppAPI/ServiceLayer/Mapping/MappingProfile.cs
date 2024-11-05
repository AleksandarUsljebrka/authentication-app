using AutoMapper;
using Data.Models;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Mapping
{
	public class MappingProfile:Profile
	{
		public MappingProfile()
		{
			CreateMap<User, UserProfileDto>()
			.ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
			.ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
			.ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
			.ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => src.IsVerified))
			.ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth));

		}
	}
}
