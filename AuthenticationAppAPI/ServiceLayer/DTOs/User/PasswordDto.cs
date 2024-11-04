using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.User
{
	public class PasswordDto
	{
		public string OldPassword { get; set; }
		public string NewPassword { get; set; }
	}
}
