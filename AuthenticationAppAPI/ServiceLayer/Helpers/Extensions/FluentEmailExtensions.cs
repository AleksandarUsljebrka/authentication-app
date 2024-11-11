using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceLayer.Helpers.Extensions
{
	public static class FluentEmailExtensions
	{
		public static void AddFluentEmail(this IServiceCollection services, ConfigurationManager configuration)
		{
			var emailSettings = configuration.GetSection("EmailSettings");

			var defaultFromEmail = emailSettings["DefaultFromEmail"];
			var host = emailSettings["SMTPSetting:Host"];
			var port = emailSettings.GetValue<int>("Port");

			services.AddFluentEmail(defaultFromEmail)
				.AddSmtpSender(host, port);
		}
	}
}
