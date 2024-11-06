import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import Button from "../components/Button";
import { UserService } from "../services/UserService";
import addPhoto from "../assets/addPhoto.png";

const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
});

const passwordSchema = yup.object().shape({
  oldPassword: yup
  .string()
  .min(6, "Password must be at least 6 characters")
  .required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

const MyProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({});
  const { updateUser, getUserProfile, getUserImage, updateUserImage, updateUserPassword } =
    UserService;
  
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [passwordData, setPasswordData] = useState({});

  const inputRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {

      const response = await getUserProfile(user.token);
      
      if (response.status >= 300 || response.status < 200) {
        toast.error("Can't get user data");
        return;
      }
      setUserData(response.data);
      
      const imgResponse = await getUserImage(user.token);
      
      if (imgResponse.status >= 300 || imgResponse.status < 200) {
        toast.error("Can't get user image");
        return;
      } else if (imgResponse.data === "NO_IMAGE" || !imgResponse.data ) {
        setProfileImage(null);
      }else{
        setProfileImage("data:image/*;base64," + imgResponse.data.image);

      }
      
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        dateOfBirth: userData.dateOfBirth || "",
      });
      setProfileImage(userData.imageUrl);
      console.log(formatDate(userData.dateOfBirth));

    }
  }, [userData]);

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      dateOfBirth: user?.dateOfBirth || "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        const updatedData = {
          ...values,
        };

        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);

          const response = await updateUserImage(formData, user.token);
          if (response.status >= 300 || response.status < 200) {
            toast.error("Can't update image");
            return;
          }
          updatedData.imageUrl = response.data.url;
        }

        const response = await updateUser(updatedData, user.token);
        if (response.status >= 300 || response.status < 200) {
          toast.error("Can't update user");
          return;
        }
        
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error("Error updating profile.");
      }
    },
  });


  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {    
        const response = await updateUserPassword(values, user.token);
        console.log(response);
        
        if (response.status >= 300 || response.status < 200) {
          toast.error(response.data? response.data: "Can't update user password");
          return;
        }
        
        toast.success("Password updated successfully!");
      } catch (error) {
        toast.error("Error updating password.");
      }
    },
  });

  const handleImageClick = (event) => {
    inputRef.current.click();
  };
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl pt-24 mx-auto min-h-screen p-4">
      <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-4xl text-gray-800 font-semibold text-center mb-8">
        My Profile
      </h1>
      <div className="relative">
      <form className="flex  flex-col w-1/3 px-4 absolute top-10 right-6 shadow-xl" onSubmit={passwordFormik.handleSubmit}>
            <div className="mb-4 pl-4 ">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Current Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                onChange={passwordFormik.handleChange}
                value={passwordFormik.values.password}
                onBlur={passwordFormik.handleBlur}
                className="mt-2 p-2 w-full border rounded-md"
              />
               {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
            <div className="text-red-600 text-sm">{passwordFormik.errors.oldPassword}</div>
          )}
            </div>

            <div className="mb-4 pl-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                onChange={passwordFormik.handleChange}
                value={passwordFormik.values.newPassword}
                onBlur={passwordFormik.handleBlur}
                className="mt-2 p-2 w-full border rounded-md"
              />
               {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
            <div className="text-red-600 text-sm">{passwordFormik.errors.newPassword}</div>
          )}
            </div>
            <div className="mb-4 pl-4">
              <Button buttonText="Change Password" className="w-full " />
            </div>
          </form>
      
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4 flex justify-between">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="profileImage"
            >
              Profile Image
            </label>
            <div
              className="mt-2 flex flex-col justify-self-start cursor-pointer"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <div className=" relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-36 h-40 mb-4  rounded-lg  border-black shadow-xl object-contain "
                  />
                  <img
                    src={addPhoto}
                    className="w-6 h-6 absolute bottom-1 -right-2"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <input
                id="profileImage"
                name="profileImage"
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className=" w-2/3 hidden"
              />
            </div>
          </div>

        
        </div>

        <div className="pt-12">
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.firstName}
            onBlur={formik.handleBlur}
            className="mt-2 p-2 w-full border rounded-md"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="text-red-600 text-sm">
              {formik.errors.firstName}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.lastName}
            onBlur={formik.handleBlur}
            className="mt-2 p-2 w-full border rounded-md"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="text-red-600 text-sm">{formik.errors.lastName}</div>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="dateOfBirth"
          >
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            onChange={formik.handleChange}
            value={formatDate(formik.values.dateOfBirth)}
            onBlur={formik.handleBlur}
            className="mt-2 p-2 w-full border rounded-md"
          />
          {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
            <div className="text-red-600 text-sm">
              {formik.errors.dateOfBirth}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={user?.email}
            disabled
            className="mt-2 p-2 w-full border rounded-md bg-gray-200 cursor-not-allowed"
          />
        </div>

        <Button buttonText="Update Profile" className="w-full mt-6" />
        </div>
      </form>
      </div>
    </div>
  );
};

const formatDate = (date) => {
  const newDate = new Date(date+'Z');
  if (isNaN(newDate)) {
    return ""; 
  }
  return newDate.toISOString().split("T")[0];
};

export default MyProfilePage;
