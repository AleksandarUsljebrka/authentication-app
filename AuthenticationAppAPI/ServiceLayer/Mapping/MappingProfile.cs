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
			CreateMap<User, UserProfileDto>().ReverseMap();
			//CreateMap<List<User>, UserListDto>().ReverseMap();
		}
	}
}
