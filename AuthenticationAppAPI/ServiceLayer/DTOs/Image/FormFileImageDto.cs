using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Image
{
	public class FormFileImageDto
	{
		public IFormFile Image {  get; set; }
	}
}
