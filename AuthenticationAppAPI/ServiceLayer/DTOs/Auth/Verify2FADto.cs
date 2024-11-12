using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Auth
{
	public class Verify2FADto
	{
		public string Token {  get; set; }
		public string Email { get; set; }

	}
}
