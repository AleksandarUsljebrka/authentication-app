using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.DTOs.Image
{
	public class GetImageDto:IDTO
	{
		public byte[] Image {  get; set; }
	}
}
