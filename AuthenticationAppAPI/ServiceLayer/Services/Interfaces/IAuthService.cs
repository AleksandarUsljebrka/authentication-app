﻿using ServiceLayer.DTOs.Result;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Services.Interfaces
{
	public interface IAuthService
	{
		Task<IResult> CreateUser(RegisterDto userDto);

	}
}