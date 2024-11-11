using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.User
{
	public class RegisterDto 
	{
		[EmailAddress]
		[Required]
		public string Email { get; set; }

		[Required]
		public string FirstName{ get; set; }

		[Required]
		public string LastName { get; set; }

		[Required]
		public DateTime DateOfBirth { get; set; }

		[Required]
		[DataType(DataType.Password)]
		public string Password { get; set; }

		public string? ClientUri { get; set; }
	}
}
