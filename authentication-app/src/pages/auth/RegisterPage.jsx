import { useState,useEffect } from "react";
import Button from "../../components/Button";
import { AuthService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
let initialUser = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
};

const registrationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  dateOfBirth: yup.date().required("Date of birth is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterUser = () => {
  const { register } = AuthService;

  const [isFormValid, setIsFormValid] = useState(false);


  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialUser,
    validationSchema: registrationSchema,

    onSubmit: async (values) => {
 
      try {
        await registrationSchema.validate(values);
        const response = await register(values);

        if (response.status === "success") {
          toast.success("Successful registration. Check Email and verify", {autoClose:5000}); 
          navigate("/login");
        }
        else if (
          response.data ||
          response.status >= 300 ||
          response.status < 200
        ) {
          toast.error(response.data);
        }
      } catch (error) {
        toast.error(error?.message || "Registration failed");
      }
    },
  });

  useEffect(()=>{
    
    setIsFormValid(formik.isValid && formik.dirty);
  }, [formik.errors, formik.touched, formik.isValid, formik.dirty]);

  return (
    <div className="flex items-start justify-center min-h-screen">
      <div className="border pt-3 mt-28 rounded-md bg-gray-300  text-gray-800  border-gray-900 w-3/5 h-fit shadow-2xl">
        <h2 className="justify-self-center text-xl md:text-2xl lg:text-3xl ">
          Registration
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-center pt-5  text-sm md:text-xl lg:text-2xl w-11/12 justify-self-center"
        >
          <div className="flex justify-around w-full">
            <div className="flex flex-col justify-center w-2/5">
              <label className="">Email</label>
              <input
                className="text-black p-2 mb-2"
                type="email"
                name="email"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                onChange={formik.handleChange}
              />

              {formik.touched.email && formik.errors.email ? (
                <p className="text-sm text-red-600 ">{formik.errors.email}</p>
              ) : null}
            </div>
            <div className="flex flex-col justify-center w-2/5">
              <label className="">Password</label>
              <input
                className="text-black p-2 mb-2"
                type="password"
                name="password"
                onBlur={formik.handleBlur}
                value={formik.values.password}
                onChange={formik.handleChange}
              />

              {formik.touched.password && formik.errors.password ? (
                <p className="text-sm text-red-600 ">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-around">
            <div className="flex flex-col justify-center w-2/5">
              <label className="">First Name</label>
              <input
                className="text-black p-2 mb-2"
                type="text"
                name="firstName"
                onBlur={formik.handleBlur}
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />

              {formik.touched.firstName && formik.errors.firstName ? (
                <p className="text-sm text-red-600 ">
                  {formik.errors.firstName}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col justify-center w-2/5">
              <label className="">Last Name</label>
              <input
                className="text-black p-2 mb-2"
                type="text"
                name="lastName"
                onBlur={formik.handleBlur}
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />

              {formik.touched.lastName && formik.errors.lastName ? (
                <p className="text-sm text-red-600 ">
                  {formik.errors.lastName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-around">
            <div className="flex flex-col justify-center w-2/5">
              <label className="mb-2">Date Of Birth</label>
              <input
                className="text-black p-2"
                type="date"
                name="dateOfBirth"
                onBlur={formik.handleBlur}
                value={formik.values.dateOfBirth}
                onChange={formik.handleChange}
              />

              {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                <p className="text-sm text-red-600 ">
                  {formik.errors.dateOfBirth}
                </p>
              ) : null}
            </div>
            <Button buttonText="Register" className="w-2/5  h-14 mt-6" disabled={!isFormValid}/>
          </div>
        </form>
        <div className="mt-10 mb-10 justify-self-center  text-gray-800 text-sm md:text-xl lg:text-2xl">
          Already have an account? Log in{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-500 transition duration-200"
          >
            here.
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
