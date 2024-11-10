import React from 'react'
import { useFormik } from "formik";
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { UserService } from '../services/UserService';
import Button from './Button';
import { useAuth } from '../context/authContext';
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

const ChangePasswordForm = () => {

    const { updateUserPassword } = UserService;
    const {user} = useAuth();
    
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
 
    return (
   
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

);
}
export default ChangePasswordForm