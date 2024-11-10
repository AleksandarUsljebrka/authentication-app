import iconLogo from '../assets/logo.png'
import { useAuth } from '../context/authContext';
 
const Navbar = () => {
   const {isLoggedIn, handleLogout,user} = useAuth();

   const isAdmin = user.role === 'Admin' && isLoggedIn;

   const onLogout = () =>{
    handleLogout();
   }
    return (
      <>
      <nav className="bg-gray-400 z-10 fixed top-0 left-0 w-screen flex justify-between items-center">
        <div className="flex ml-10">
        <img
          src={iconLogo}
          alt="Logo"
          className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 mr-3"

        />
          <h2 className="text-base md:text-xl lg:text-2xl pointer-events-none">
            Authentication App
          </h2>
        </div>
        <ul className="pr-3 flex  w-2/5 text-gray-800 h-20 items-center lg:text-2xl md:text-2xl sm:text-lg text-sm relative">
            {!isLoggedIn && <li className="relative group m-auto">
              <a
                href="/login"
                className="hover:text-gray-700 transition duration-300"
              >
                Log in
              </a>
              <span className="absolute left-0 bottom-0 h-[2px] bg-gray-600 w-0 transition-width duration-300 group-hover:w-full"></span>
            </li>}
           {!isLoggedIn && <li className="relative group m-auto">
              <a
                href="/register"
                className="hover:text-gray-700 transition duration-300"
              >
                Register
              </a>
              <span className="absolute left-0 bottom-0 h-[2px] bg-gray-600 w-0 transition-width duration-300 group-hover:w-full"></span>
            </li>}
            {isLoggedIn && <li className="relative group m-auto">
              <a
                href="/"
                className="hover:text-gray-700 transition duration-300"
              >
                Home
              </a>
              <span className="absolute left-0 bottom-0 h-[2px] bg-gray-600 w-0 transition-width duration-300 group-hover:w-full"></span>
            </li>}
            {isLoggedIn && <li className="relative group m-auto">
              <a
                href="/my-profile"
                className="hover:text-gray-700 transition duration-300"
              >
                My Profile
              </a>
              <span className="absolute left-0 bottom-0 h-[2px] bg-gray-600 w-0 transition-width duration-300 group-hover:w-full"></span>
            </li>}
            {isAdmin && <li className="relative group m-auto">
              <a
                href="/all-users"
                className="hover:text-gray-700 transition duration-300"
              >
                Users
              </a>
              <span className="absolute left-0 bottom-0 h-[2px] bg-gray-600 w-0 transition-width duration-300 group-hover:w-full"></span>
            </li>}
            {isLoggedIn && (
          <li className="relative group m-auto">
            <button
              onClick={handleLogout}
              className="hover:text-gray-600 transition duration-300"
            >
              Log out
            </button>
            <span className="absolute left-0 bottom-0 h-[2px] bg-gray-600 w-0 transition-width duration-300 group-hover:w-full"></span>
          </li>
        )}
        </ul>
      </nav>
    </>
    
    );
  };
export default Navbar;
