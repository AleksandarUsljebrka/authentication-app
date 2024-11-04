﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Result
{
	public interface IResult
	{
		bool Successful { get; set; }
		string ErrorMess { get; set; }
		IDTO Dto { get; set; }
		ErrorCode ErrorCode { get; set; }
		string Token { get; set; }
		
	}
}
