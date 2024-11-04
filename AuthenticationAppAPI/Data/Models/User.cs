using Microsoft.AspNetCore.Identity;

namespace Data.Models
{

	public class User : IdentityUser
	{
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public DateTime DateOfBirth { get; set; }
		public bool IsVerified { get; set; }
		public string ProfileImage { get; set; }
	}

}
