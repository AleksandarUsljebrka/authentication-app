using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Auth
{
	public class VerifyEmailDto
	{
		public string Token { get; set; }
		public string Email { get; set; }
	}
}
