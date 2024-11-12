
const UserCardComponent = ({user, handleDelete}) => {
  return (
    <div
    key={user.id}
    className="bg-white h- rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
  >
    <div className="px-6 pt-6 pb-2 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold mr-4">
          {user.firstName.charAt(0)}
          {user.lastName.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500">
            {new Date(user.dateOfBirth).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex-grow"></div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handleDelete(user.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 focus:outline-none"
        >
          Delete User
        </button>
      </div>
    </div>
  </div>
  )
}

export default UserCardComponent