using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using MimeKit;

namespace ServiceLayer.Helpers.Email
{
	public class EmailSender : IEmailSender
	{
		public void SendEmail(string message, string email, string subject)
		{
			var emailMessage = new MimeMessage();
			emailMessage.From.Add(new MailboxAddress("AtuhApp", "aleksandar.web2testmail@gmail.com"));
			emailMessage.To.Add(new MailboxAddress("", email));
			emailMessage.Subject = subject;
			emailMessage.Body = new TextPart("html") { Text = message };

			using (var client = new SmtpClient())
			{
				client.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
				client.Authenticate("aleksandar.web2testmail@gmail.com", "zwsfthhntmciwwla");
				client.Send(emailMessage);
				client.Disconnect(true);
			}
		}
	}
}
