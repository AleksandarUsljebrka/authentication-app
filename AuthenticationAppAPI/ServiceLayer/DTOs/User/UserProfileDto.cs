
namespace ServiceLayer.DTOs.User
{
	public class UserProfileDto:IDTO
	{
		public string Id { get; set; }
		public string Email { get; set; }
		public string FirstName { get; set; }
		public string LastName { get; set; }
		public DateTime DateOfBirth { get; set; }
		public bool IsVerified { get; set; }
	}
}
