import { createContext, useCallback, useContext, useState } from "react";
import tokenHelper from "../helpers/TokenHelper";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  handleLogin: () => {},
  handleLogout: () => {},
  loadUser:() => {},
  isLoggedIn: false,
  isLoading:true,
  id: "",
  token: "",
  email: "",
  role:""
});
let initialUser ={
    email:'',
    token:'',
    role:'',
    id:''
}
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(initialUser);
    const [isLoading, setIsLoading] = useState(true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();
    const handleLogin = async (data) => {
        try{
            tokenHelper.saveToken(data);

            const user = tokenHelper.getUser();

            setUser(user)
            setIsLoggedIn(true);
        }catch(error){
            alert("Login Failed!")
        }
    }

    const logout = async (data) =>{
        try{
            tokenHelper.removeToken();

            setIsLoggedIn(false);
            navigate('/login')
        }catch(error){
            alert("Failed Logout");
        }
    }
    const loadUser = useCallback(async ()=>{
        setIsLoading(false);
        if(!tokenHelper.isLoggedin()){
            setUser(initialUser)
            return;
        }
        if(tokenHelper.isTokenExpired()){
            tokenHelper.removeToken();
            setUser(initialUser);
            return;
        }

        setIsLoggedIn(tokenHelper.isLoggedin());
        const userData = tokenHelper.getUser();
        setUser(userData);
    }, [])

  return <AuthContext.Provider
    value={{
        handleLogin:handleLogin,
        handleLogout:logout,
        loadUser:loadUser,
        isLoggedIn:isLoggedIn,
        user:user,
        isLoading:isLoading
    }}
  >{children}</AuthContext.Provider>;
};

export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if(!context) throw new Error("Auth context can not be null");
    return context;
}
