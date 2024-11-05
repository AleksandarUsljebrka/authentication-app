import { useState } from "react";
import Button from "../../components/Button";

let initialUser = {
    email: "",
    password: "",
  };

const LoginUser = () => {
    const [user, setUser] = useState(initialUser);
    const [error, setError] = useState('');
  
  
    function onChange(e) {
      const { value, name } = e.target;
  
      setUser((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    const onSubmit = async (e)=> {
      e.preventDefault();
      
      setError('');
      try{
       console.log(user);
       
        
      }catch(error){
        setError(error?.message || "Login failed");
      }
    
    }
    return (
        <div className="flex items-start justify-center min-h-screen">
        <div className="border pt-3 mt-28 rounded-md bg-gray-500  border-gray-900 w-1/2 h-fit shadow-2xl">
          <h2 className="justify-self-center text-xl md:text-2xl lg:text-3xl text-white">
            User Login
          </h2>
          <form
              onSubmit={onSubmit} 
              className="flex flex-col  pt-5 text-white text-sm md:text-xl lg:text-2xl w-4/6 justify-self-center">
            <label className="mb-2">
              Email
            </label>
            <input
              className="text-black p-2"
              type="email"
              name="email"
              value={user?.email}
              onChange={(e) => onChange(e)}
            />
    
            <label className="mb-2 mt-5">
              Password
            </label>
            <input
              className="text-black p-2"
              type="password"
              name="password"
              value={user?.password}
              onChange={(e) => onChange(e)}
            />
            
            <Button buttonText="Log in" className='mt-6'/>

          </form>
         <div className="mt-10 mb-10 justify-self-center pl-3 pr-3 text-white text-sm md:text-xl lg:text-2xl">
              Don't have an account? Register <a href="/register" className="text-blue-400 hover:text-blue-500 transition duration-200">here.</a>
          </div>
    
        </div>
      </div>
      )
  };
  
  export default LoginUser;