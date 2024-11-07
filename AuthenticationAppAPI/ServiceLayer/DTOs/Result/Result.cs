﻿using Microsoft.AspNetCore.Http;
using ServiceLayer.DTOs.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Result
{
	public class Result : IResult
	{
		public bool Successful { get; set; }
		public string ErrorMess { get; set; }
		public IDTO Dto { get; set; }
		public ErrorCode ErrorCode { get; set; }
		public string Token { get; set; }
		public int UserTotalCount { get; set; }
		public UserListDto UserListDto { get; set; }

		public Result(bool successful, ErrorCode erCode, string mess)
		{
			Successful = successful;
			ErrorCode = erCode;
			ErrorMess = mess;
		}
		public Result(bool successful, ErrorCode erCode)
		{
			Successful = successful;
			ErrorCode = erCode;

		}
		public Result(bool successful)
		{
			Successful = successful;
		}

		public Result(bool successful, string token)
		{
			Successful = successful;
			Token = token;
		}
		public Result(bool successful, IDTO dto)
		{
			Successful = successful;
			Dto = dto;
		}
		public Result(bool successful, UserListDto userListDto, int userCount)
		{
			Successful = successful;
			UserTotalCount = userCount;
			UserListDto = userListDto;
		}
	}
}
