using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Auth
{
	public class GoogleLoginDto : IDTO
	{
		[Required]
		public string Code { get; set; }


	}
}
