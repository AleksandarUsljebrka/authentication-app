import React, { useEffect, useState } from 'react'
import { AdminService } from '../services/AdminService'
import { useAuth } from '../context/authContext';

const AllUsersPage = () => {
    const [users, setUsers] = useState([]);

    const {getAllUsers} = AdminService;
    const {user} = useAuth();

    useEffect(()=>{
        const fetchUsers = async()=>{
            const response = await getAllUsers(user.token);
            
            if(response.status >=300 || response.status<200)
                alert(response.data)
            else{

                setUsers(response.data.users);
                console.log(response.data.users)
            }
        }

        fetchUsers();
    },[])
    
  return (
<div className="container  min-h-screen mx-auto py-24">
<h2 className="text-3xl font-semibold text-center mb-6">Users List</h2>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {users.map((user) => (
    <div
      key={user.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold mr-4">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500">{new Date(user.dateOfBirth).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex justify-center items-center mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 focus:outline-none">
            Delete User
          </button>
        
        </div>
      </div>
    </div>
  ))}
</div>
</div>
  )
}

export default AllUsersPage