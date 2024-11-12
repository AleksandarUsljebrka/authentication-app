import UserCardComponent from "./UserCardComponent"

const AllUsersGridComponent = ({children, users,handleDelete}) => {
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-3 gap-2 px-2">
      {users.map((user) => (
       <UserCardComponent key={user.id} user={user} handleDelete={handleDelete}/>
      ))}
    </div>
   
  </>
  )
}

export default AllUsersGridComponent