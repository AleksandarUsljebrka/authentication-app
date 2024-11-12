
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
import VerificationFilterComponent from "../components/AllUsers/VerificationFilterComponent";

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
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState("all"); // 'all', 'verified', 'unverified'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const { getAllUsers, deleteUser, filterUsers, searchByEmail } = AdminService;
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    let response;
    if (isSearchActive) {
      response = await searchByEmail(email, verificationFilter, user.token);
    } else if (isFilterActive && !isSearchActive) {
      const filterDataWithNullDates = {
        startDate: filterData.startDate || null,
        endDate: filterData.endDate || null,
        isVerified: verificationFilter,
      };
      response = await filterUsers(filterDataWithNullDates, user.token);
    } else {
      response = await getAllUsers(user.token, verificationFilter, currentPage, pageSize);
    }

    if (response.status >= 300 || response.status < 200) {
      toast.error(response.data || "Error loading users");
    } else {
      if(isSearchActive)
        setUsers([response.data])
      else
        setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.count / pageSize));
    }
  }, [ isSearchActive,isFilterActive, verificationFilter, currentPage, getAllUsers, filterUsers, searchByEmail, user.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await deleteUser(userToDelete, user.token);
        if (response.status >= 300 || response.status < 200) {
          toast.error(response.data || "Failed to delete user");
        } else {
          toast.success("User deleted successfully!");
          setIsModalOpen(false);
          fetchUsers(); 
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleSearchSubmit = () => {
    setIsSearchActive(true);    
  };

  const handleFilterSubmit = () => {
    setIsFilterActive(true);
  };

  const handleClearFilter = () => {
    setFilterData(initialFilter);
    setIsFilterActive(false);
  };

  const handleClearSearch = () => {
    setEmailData("");
    setIsSearchActive(false);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container min-h-screen mx-auto pt-24">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Users List
      </h2>

      <div className="flex flex-wrap justify-between gap-6 mb-8 px-2">
        <FilterDateComponent
          handleFilterChange={(e) =>
            setFilterData({ ...filterData, [e.target.name]: e.target.value })
          }
          filterData={filterData}
        >
          <Button
            buttonText={!isFilterActive ? "Filter" : "Clear"}
            disabled={!filterData.startDate && !filterData.endDate}
            className="w-20 sm:h-10 lg:h-12 h-10"
            onClick={!isFilterActive ? handleFilterSubmit : handleClearFilter}
          />
        </FilterDateComponent>

        <SearchEmailComponent
          email={email}
          handleEmailChange={(e) => setEmailData(e.target.value)}
        >
          <Button
            buttonText={!isSearchActive ? "Search" : "Clear"}
            className="w-5/6 px-3"
            disabled={!email}
            onClick={!isSearchActive ? handleSearchSubmit : handleClearSearch}
          />
        </SearchEmailComponent>

       <VerificationFilterComponent verificationFilter={verificationFilter} setVerificationFilter={setVerificationFilter}/>
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
