import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { UserService } from "../services/UserService";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ChangeUserProfileForm from "../components/ChangeUserProfileForm";


const profileSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
});


const MyProfilePage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({});
  const { updateUser, getUserProfile, getUserImage, updateUserImage } =
    UserService;
  
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  const inputRef = useRef();

 
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
          is2FAEnabled,
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

  const handleImageClick = () => {
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

  const handle2FAChange = () =>{
    setIs2FAEnabled(prev => !prev);
  }

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
  }, [getUserImage,getUserProfile,user.token]);

  useEffect(() => {
    if (userData) {
      formik.setValues({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        dateOfBirth: userData.dateOfBirth || "",
      });
      console.log(userData)
      setProfileImage(userData.imageUrl);
      setIs2FAEnabled(!!userData.is2FAEnabled)
    }
  }, [userData]);

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
      is2FAEnabled={is2FAEnabled}
      handle2FAChange={handle2FAChange}
      />
      </div>
    </div>
  );
};


export default MyProfilePage;
