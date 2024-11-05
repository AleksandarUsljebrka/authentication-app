import { useState } from "react";
import Button from "../../components/Button";

let initialUser= {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth:"" 
  };

const RegisterUser = () => {
    const [user, setUser] = useState(initialUser);
    const [error,setError] = useState('');
    
    function onChange(e) {
      const { value, name } = e.target;
  
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    const onSubmit = async(e)=> {
      e.preventDefault();
      try{
            console.log(user);
          
      }catch(error){
          setError(error?.message || "Registration failed");
      }
    }
    return (
      <div className="flex items-start justify-center min-h-screen">
        <div className="border pt-3 mt-28 rounded-md bg-gray-500  border-gray-900 w-3/5 h-fit shadow-2xl">
          <h2 className="justify-self-center text-xl md:text-2xl lg:text-3xl text-white">
            Registration
          </h2>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center pt-5 text-white text-sm md:text-xl lg:text-2xl w-11/12 justify-self-center"
          >
            <div className="flex justify-around w-full">
              <div className="flex flex-col justify-center w-2/5">
                <label className="">Email</label>
                <input
                  className="text-black p-2 mb-2"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="flex flex-col justify-center w-2/5">
                <label className="">Password</label>
                <input
                  className="text-black p-2 mb-2"
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
  
            <div className="flex justify-around">
              <div className="flex flex-col justify-center w-2/5">
                <label className="">First Name</label>
                <input
                  className="text-black p-2 mb-2"
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div className="flex flex-col justify-center w-2/5">
                <label className="">Last Name</label>
                <input
                  className="text-black p-2 mb-2"
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
  
            <div className="flex justify-around">
              <div className="flex flex-col justify-center w-2/5">
                <label className="mb-2">Date Of Birth</label>
                <input
                  className="text-black p-2"
                  type="date"
                  name="dateOfBirth"
                  value={user.dateOfBirth}
                  onChange={(e) => onChange(e)}
                />
              </div>
           <Button buttonText="Register" className="w-2/5 mt-6"/>
            </div>
  
          </form>
          <div className="mt-10 mb-10 justify-self-center text-white text-sm md:text-xl lg:text-2xl">
            Already have an account? Log in {" "}
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
  