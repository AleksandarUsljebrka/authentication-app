using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.User
{
	public class PasswordDto
	{
		[Required]
		public string OldPassword { get; set; }
		[Required]
		[MinLength(6)]
		public string NewPassword { get; set; }
	}
}
