using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.User
{
	public class CreatePasswordDto
	{
		public string Password { get; set; }
		public string ConfirmPassword { get; set; }
	}
}
