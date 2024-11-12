import React, { useCallback, useEffect, useState } from "react";
import { AdminService } from "../services/AdminService";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";
import Button from "../components/Button";
import FilterDateComponent from "../components/AllUsers/FilterComponent";
import SearchEmailComponent from "../components/AllUsers/SearchEmailComponent";
import ModalComponent from "../components/AllUsers/ModalComponent";
import AllUsersGridComponent from "../components/AllUsers/AllUsersGridComponent";
import PaginationComponent from "../components/AllUsers/PaginationComponent";

let initialFilter = {
  startDate: "",
  endDate: "",
  email: "",
};
const AllUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filterData, setFilterData] = useState({
    startDate: "",
    endDate: "",
  });
  const [email, setEmailData] = useState("");

  const [fetch, setFetch] = useState(false);

  const { getAllUsers, deleteUser, filterUsers, searchByEmail } = AdminService;
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isFilterActive, setIsFilterActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await deleteUser(userToDelete, user.token);
        console.log(response);
        if (response.status >= 300 || response.status < 200) {
          toast.error(response.data ? response.data : "Failed to delete user");
          throw new Error();
        }

        toast.success("User deleted successfully!");
        setIsModalOpen(false);
        setFetch(true);
      } catch (error) {
        setIsModalOpen(false);
        // toast.error("Failed to delete user");
      }
    }
  };

  const handleSearchSubmit = useCallback(async () => {
    setIsSearchActive(true);
    try {
      const response = await searchByEmail(email, user.token);
      console.log(response);
      if (response.status >= 300 || response.status < 200) {
        toast.error("Search failed");
        setEmailData("");
      } else {
        setUsers([response.data]);
      }
    } catch (error) {
      toast.error("Search failed");
    }
  },[email,searchByEmail, user.token]);
  
  
  const handleFilterSubmit = useCallback( async () => {
    const filterDataWithNullDates = {
      startDate: filterData.startDate ? filterData.startDate : null,
      endDate: filterData.endDate ? filterData.endDate : null,
    };
    setIsFilterActive(true);
    try {
      const response = await filterUsers(filterDataWithNullDates, user.token);
      console.log(response);
      if (response.status >= 300 || response.status < 200) {
        toast.error("Filter failed");
        setFilterData(initialFilter);
      } else {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Filter failed");
    }
  },[filterData, filterUsers, user.token]);

  
  const handleFilterChange = (e) => {
    setIsFilterActive(false);
    setFilterData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEmailChange = (e) => {
    setIsSearchActive(false);
    setEmailData(e.target.value);
  };
 
  const handleClearFilter = (e) => {
    setFilterData(initialFilter);
    setIsFilterActive(false);
    setFetch(true);
  };
  const handleClearSearch = () => {
    setEmailData("");
    setIsSearchActive(false);
    setFetch(true);
  };
  const fetchUsers = useCallback(async () => {
    const response = await getAllUsers(user.token, currentPage, pageSize);
    if (response.status >= 300 || response.status < 200) {
      toast.error(response.data);
    } else {
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    }
    setFetch(false);
  },[currentPage, getAllUsers,user.token]);

  useEffect(() => {
    if (isFilterActive && !isSearchActive) {
      handleFilterSubmit();
    } else if (isSearchActive) {
      handleSearchSubmit();
    } else {
      fetchUsers();
    }
  }, [fetch, isFilterActive, isSearchActive, currentPage, fetchUsers, handleSearchSubmit, handleFilterSubmit]);

  

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const isDateFilterEmpty = !filterData.endDate && !filterData.startDate;
 
  return (
    <div className="container  min-h-screen mx-auto pt-24">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Users List
      </h2>

      <div className="flex flex-wrap justify-between gap-6 mb-8 px-2">
        <FilterDateComponent
          handleFilterChange={handleFilterChange}
          filterData={filterData}
        >
          <Button
            buttonText={!isFilterActive ? "Filter" : "Clear"}
            disabled={isDateFilterEmpty}
            className="w-20 sm:h-10 lg:h-12 h-10"
            onClick={!isFilterActive ? handleFilterSubmit : handleClearFilter}
          />
        </FilterDateComponent>

        <SearchEmailComponent
          email={email}
          handleEmailChange={handleEmailChange}
        >
          <Button
            buttonText={!isSearchActive ? "Search" : "Clear"}
            className="w-5/6 px-3"
            disabled={!email}
            onClick={!isSearchActive ? handleSearchSubmit : handleClearSearch}
          />
        </SearchEmailComponent>
      </div>

      <ModalComponent
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        confirmDelete={confirmDelete}
      />

      {users.length > 0 ? (
        <>
          <AllUsersGridComponent users={users} handleDelete={handleDelete} />
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            isFilterActive={isFilterActive}
            isSearchActive={isSearchActive}
          />
        </>
      ) : (
        <div className="text-3xl text-gray-800 font-semibold flex justify-center items-center">
          No user matches your filter...
        </div>
      )}
    </div>
  );
};

export default AllUsersPage;
