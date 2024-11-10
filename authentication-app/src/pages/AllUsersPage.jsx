import React, { useEffect, useState } from "react";
import { AdminService } from "../services/AdminService";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Button from "../components/Button";

let initialFilter={
  startDate:'',
  endDate:'',
  email:''
}
const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filterData, setFilterData] = useState({
    startDate:'',
    endDate:'',
  })
  const [email, setEmailData] = useState('');

  const [fetch, setFetch] = useState(false);

  const { getAllUsers, deleteUser, filterUsers, searchByEmail } = AdminService;
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8

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
  const fetchUsers = async () => {
    const response = await getAllUsers(user.token, currentPage, pageSize);
    if (response.status >= 300 || response.status < 200) {
      toast.error(response.data);
      setFetch(false);
    } else {
      setFetch(false);
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.count/pageSize));
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [fetch, currentPage]);



  const handleFilterChange = (e)=>{
    setIsFilterActive(false);
    setFilterData(prev =>(
      {
        ...prev,
        [e.target.name]:e.target.value
      }
    ))
  }
  const handleEmailChange = (e)=>{
    setIsSearchActive(false);
    setEmailData(e.target.value);
  }
  const handleFilterSubmit = async (e)=>{
    const filterDataWithNullDates = {
      startDate: filterData.startDate ? filterData.startDate : null,
      endDate: filterData.endDate ? filterData.endDate : null
    };
    setIsFilterActive(true);
    try{
      const response = await filterUsers(filterDataWithNullDates, user.token);
      console.log(response);
      if (response.status >= 300 || response.status < 200) {
        toast.error("Filter failed");
        setFilterData(initialFilter)

      }else{
        setUsers(response.data.users);
      }
    
    }catch(error){
      toast.error("Filter failed")
    }
    
  }

  const handleSearchSubmit = async (e)=>{
    setIsSearchActive(true)
    try{
      const response = await searchByEmail(email, user.token);
      console.log(response);
      if (response.status >= 300 || response.status < 200) {
        toast.error("Search failed");
        setEmailData('');

      }else{
      setUsers([response.data])
      
      }
    
    }catch(error){
      toast.error("Search failed")
    }
    
  }

  const handleClearFilter = (e)=>{
    setFilterData(initialFilter);
    setIsFilterActive(false);
    setFetch(true);
  }
const handleClearSearch =()=>{
  setEmailData('');
  setIsSearchActive(false);
  setFetch(true);

}

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const isDateFilterEmpty = !filterData.endDate && !filterData.startDate
  const isEmailSearchEmpty = !email.email;
  
  return (
    <div className="container  min-h-screen mx-auto pt-24">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Users List</h2>

      <div className="flex flex-wrap justify-between gap-6 mb-8 px-2">

        <div className="flex gap-3">
          
          <label className="font-semibold text-sm text-gray-800 pt-2">Filter By Date Of Birth:</label>
          
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            
          <input
            type="date"
            name="startDate"
            max={filterData.endDate}
            value={filterData.startDate}
            onChange={(e) => handleFilterChange(e)}
            className="px-4 py-2 border rounded-lg text-sm"
            placeholder="Start Date"
            />
          <input
            type="date"
            min={filterData.startDate}
            name="endDate"
            value={filterData.endDate}
            onChange={(e) => handleFilterChange(e)}
            className="px-4 py-2 border rounded-lg text-sm"
            placeholder="End Date"
            />
            </div>
          <Button buttonText={!isFilterActive? "Filter":"Clear"}
          disabled={isDateFilterEmpty}
             className="w-20 sm:h-10 lg:h-12 h-10" onClick={!isFilterActive? handleFilterSubmit:handleClearFilter}/>

        </div>

        <div className="flex gap-4 ">
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => handleEmailChange(e)}
            className="px-4 py-2 border rounded-lg text-sm"
            placeholder="Search by Email"
          />
          <Button buttonText={!isSearchActive? "Search":"Clear"} className="w-5/6 " disabled={!email} 
          onClick={!isSearchActive ? handleSearchSubmit:handleClearSearch}/>
        </div>
      </div>

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

    { users.length>0 ? 
    <>
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
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
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 bg-gray-300 rounded-full ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        <span className="text-gray-700">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-4 py-2 bg-gray-300 rounded-full ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &gt;
        </button>
      </div>
      </>
      :
      <div className="text-3xl text-gray-800 font-semibold flex justify-center items-center">
        No user matches your filter...
      </div>
      }
    </div>
  );
};

export default AllUsersPage;
