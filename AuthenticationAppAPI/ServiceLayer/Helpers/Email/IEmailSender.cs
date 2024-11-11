using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Helpers.Email
{
	public interface IEmailSender
	{
		//Task SendEmailAsync(string email, string subject, string message);
		void SendEmail(string message, string email,string subject);

	}
}
