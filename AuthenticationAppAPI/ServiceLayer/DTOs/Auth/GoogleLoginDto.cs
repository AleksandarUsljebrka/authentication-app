using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Auth
{
	public class GoogleLoginDto : IDTO
	{
		public string Code { get; set; }


	}
}
