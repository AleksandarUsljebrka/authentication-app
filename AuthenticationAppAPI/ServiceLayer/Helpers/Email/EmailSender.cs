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
		//private readonly IConfiguration _configuration;

		//public EmailSender(IConfiguration configuration)
		//{
		//	_configuration = configuration;
		//}

		//public async Task SendEmailAsync(string email, string subject, string message)
		//{
		//var mail = "primalac.web2testmail@gmail.com";
		//var mail = "aleksandar.usljebrka@gmail.com";
		//var pass = "brajant2000";
		//var smtpClient = new SmtpClient(_configuration["SmtpSettings:Host"])
		//var smtpClient = new SmtpClient("smtp-mail.outlook.com", 587, MailKit.Security.SecureSocketOptions.StartTls)
		//{
		//	//Port = int.Parse(_configuration["SmtpSettings:Port"]),
		//Credentials = new NetworkCredential(_configuration["SmtpSettings:Username"], _configuration["SmtpSettings:Password"]),
		//	EnableSsl = true,
		/// <summary>
		/// 	Credentials = new NetworkCredential(mail,pass)
		/// </summary>
		/// <returns></returns>
		//};

		//var mailMessage = new MailMessage
		//{
		//From = new MailAddress(_configuration["SmtpSettings:From"]),

		//Subject = subject,
		//Body = message,
		//IsBodyHtml = true,
		//};
		//mailMessage.To.Add(email);

		//await smtpClient.SendMailAsync(new MailMessage(from:mail,to:email, subject, message));
		//}

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
