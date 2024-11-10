import React from 'react'
import Button from './Button';
import addPhoto from "../assets/addPhoto.png";


const ChangeUserProfileForm = ({
    formik,
  profileImage,
  handleImageClick,
  handleImageChange,
  userData,
  inputRef
}) => {
    return (
        <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="profileImage">
              Profile Image
            </label>
            <div
              className="mt-2 flex flex-col justify-self-start cursor-pointer"
              onClick={handleImageClick}
            >
              {profileImage ? (
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-36 h-40 mb-11 rounded-lg border-black shadow-xl object-contain"
                  />
                  <img src={addPhoto} className="w-6 h-6 absolute bottom-6   -right-2" />
                </div>
              ) : (
                <div className="w-36 h-40 mb-11 ml-3 rounded-full bg-gray-300 flex items-center justify-center">
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
                className="w-2/3 hidden"
              />
            </div>
          </div>
        </div>
  
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