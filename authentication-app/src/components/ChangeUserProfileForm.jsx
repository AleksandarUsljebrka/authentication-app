import React from 'react'
import Button from './Button';
import ImageUploader from './MyProfile/ImageUploader';
import { useAuth } from '../context/authContext';


const ChangeUserProfileForm = ({
    formik,
  profileImage,
  handleImageClick,
  handleImageChange,
  userData,
  inputRef,
  handle2FAChange,
  is2FAEnabled
}) => {
    const {user} = useAuth();

    return (
        <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
       
        <ImageUploader
            label="Profile Image"
            profileImage={profileImage}
            handleImageChange={handleImageChange}
            handleImageClick={handleImageClick}
            inputRef={inputRef}
        />
        <div className="pt-12">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.firstName  || ""}
              onBlur={formik.handleBlur}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-red-600 text-sm">{formik.errors.firstName}</div>
            )}
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.lastName  || ""}
              onBlur={formik.handleBlur}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-red-600 text-sm">{formik.errors.lastName}</div>
            )}
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              onChange={formik.handleChange}
              value={formatDate(formik.values.dateOfBirth)  || ""}
              onBlur={formik.handleBlur}
              className="mt-2 p-2 w-full border rounded-md"
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <div className="text-red-600 text-sm">{formik.errors.dateOfBirth}</div>
            )}
          </div>
  
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData?.email  || ""}
              disabled
              className="mt-2 p-2 w-full border rounded-md bg-gray-200 cursor-not-allowed"
            />
          </div>
         {user.isGoogleLogedIn ==="form" && <div className="mb-4 flex items-center justify-start">
            <label className="mr-10 text-sm font-medium text-gray-700" htmlFor="2fa">
              Two Factor Authentication
            </label>
            <input
              id="2fa"
              name="2fa"
              type="checkbox"
              checked={is2FAEnabled}
              onChange={handle2FAChange}
              className="p-2 h-5 w-5 border rounded-md bg-gray-200"
            />
          </div>}
          <Button buttonText="Update Profile" className="w-full mt-6" />
        </div>
      </form>
    );
}

const formatDate = (date) => {
    const newDate = new Date(date+'Z');
    if (isNaN(newDate)) {
      return ""; 
    }
    return newDate.toISOString().split("T")[0];
  };
export default ChangeUserProfileForm