import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import Button from "../components/Button";
import { UserService } from "../services/UserService";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ChangeUserProfileForm from "../components/ChangeUserProfileForm";


const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
});


const MyProfilePage = () => {
  const { user, isGoogleLogedIn } = useAuth();
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
      console.log(isGoogleLogedIn) 
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
      {
        user.isGoogleLogedIn ==='form' && <ChangePasswordForm/>
      }
     <ChangeUserProfileForm
      formik={formik}
      profileImage={profileImage}
      handleImageClick={handleImageClick}
      handleImageChange={handleImageChange}
      userData={userData}
      inputRef={inputRef}
      />
      </div>
    </div>
  );
};


export default MyProfilePage;
