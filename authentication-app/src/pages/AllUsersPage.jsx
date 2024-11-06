import React, { useEffect, useState } from "react";
import { AdminService } from "../services/AdminService";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import Modal from "react-modal";

const AllUsersPage = () => {
  const [users, setUsers] = useState([]);

  const [fetch, setFetch] = useState(false);

  const { getAllUsers, deleteUser } = AdminService;
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await deleteUser(userToDelete, user.token);
        console.log(response);
        if(response.status >= 300 || response.status<200 ){
           
            toast.error(response.data? response.data:"Failed to delete user");
            throw new Error();

            
        }

        toast.success("User deleted successfully!");
        setIsModalOpen(false);
        setFetch(true);
      } catch (error) {
        setIsModalOpen(false)
        // toast.error("Failed to delete user");
      }
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers(user.token);
      if (response.status >= 300 || response.status < 200) {
        alert(response.data);
        setFetch(false);
      } else {
        setFetch(false);
        setUsers(response.data.users);
        console.log(response.data.users);
      }
    };
    fetchUsers();
  }, [fetch]);

  return (
    <div className="container  min-h-screen mx-auto py-24">
      <h2 className="text-3xl font-semibold text-center mb-6">Users List</h2>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Delete"
        className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-800"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h3 className="text-xl font-semibold mb-4">
            Are you sure you want to delete this user?
          </h3>
          <div className="flex justify-around">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
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
        ))}
      </div>
    </div>
  );
};

export default AllUsersPage;
