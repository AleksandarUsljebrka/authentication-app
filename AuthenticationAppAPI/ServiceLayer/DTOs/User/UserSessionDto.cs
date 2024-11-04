using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.User
{
		public record UserSessionDto(string Id, string Email, string Role);	
}
