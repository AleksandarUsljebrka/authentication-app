import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../context/authContext";
import { AuthService } from "../../services/AuthService";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import {  useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "../../components/GoogleButton";
import { useNavigate } from "react-router-dom";
// import g from 'src/assets/google.p';
let initialUser = {
  email: "",
  password: "",
};

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const LoginUser = () => {
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  
  const navigate = useNavigate();

  const { handleLogin,setEmail } = useAuth();
  const { login, googleLogin } = AuthService;

  const formik = useFormik({
    initialValues: initialUser,
    validationSchema: loginSchema,
    validateOnChange:true,
    onSubmit: async (values) => {
      setError("");
      try {
        const response = await login(values);
        
        if (response.status >= 300 || response.status < 200) {
          setError(response.data);
          toast.error(response.data);
        } else if (response.data === "DELETED") {
          toast.error("Your account has been deleted");
        } else if(response.data ==="NOT_VERIFIED"){
          toast.error("Your account is not verified. Check Email");
        }else if(response.data === "2FA"){
          setEmail(values.email);
          navigate("/verify-2fa");
        }else {
          await handleLogin(response.data);
        }
      } catch (error) {
        setError(error?.message || "Login failed");
      }
    },
  });

  useEffect(()=>{
    
    setIsFormValid(formik.isValid && formik.dirty);
  }, [formik.errors, formik.touched, formik.isValid, formik.dirty]);

  
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const response = await googleLogin(code);

      if(response.status<200 || response.status>=300){
        toast.error("Google login failed");
        return;
      }else if(response.data ==="NOT_GOOGLE"){
        toast.error("You're not registred by Google. Try login form insted!",{autoClose:4000});
      }else{
        await handleLogin(response.data);

      }

      console.log(response);
    },
    flow: 'auth-code',
  });
 
 
  return (
    <div className="flex items-start justify-center min-h-screen">
      <div className="border pt-3 mt-28 rounded-md bg-gray-300 shadow-2xl text-gray-800  border-gray-900 w-1/2 h-fit ">
        <h2 className="justify-self-center text-xl md:text-2xl lg:text-3xl">
          User Login
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col  pt-5 text-sm md:text-xl lg:text-2xl w-4/6 justify-self-center"
        >
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
            <p className="text-sm text-red-600 ">{formik.errors.password}</p>
          ) : null}

          <div className="h-">
            <Button
              buttonText="Log in"
              className="mt-6 w-full"
              disabled={!isFormValid}
            />
          <GoogleButton onClick={()=>handleGoogleLogin()}
            />
            {/* <GoogleLogin
            className='w-full'
              onSuccess={(response) => {
                const login = async () => {
                  const resp = await googleLogin(response.credential);
                  console.log(resp);
                  await handleLogin(resp.data);
                };
                login();
              }}
              onFailure={() => {}}
            /> */}
          </div>
        </form>
        <div className="mt-10 mb-10 justify-self-center pl-3 pr-3  text-gray-800 text-sm md:text-xl lg:text-2xl">
          Don't have an account? Register{" "}
          <a
            href="/register"
            className="text-blue-400 hover:text-blue-500 transition duration-200"
          >
            here.
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;
