using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.User
{
	public class UserFilter:IDTO
	{

		public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }
		public string IsVerified { get; set; }

	}
}
