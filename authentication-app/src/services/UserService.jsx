import axios from "axios";
import { baseUrl } from "../config/config";

export const UserService = {
    updateUser:async (data,token) =>{  
        try{
            const response = await axios.put(`${baseUrl}/user/my-profile`,data,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            
            return response;
        }catch(error){
            return error.response;
        }
    },
    getUserProfile:async (token) =>{  
        try{
            const response = await axios.get(`${baseUrl}/user/my-profile`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            
            return response;
        }catch(error){
            return error.response;
        }
    },
    updateUserImage:async (data,token) =>{  
        try{
            const response = await axios.put(`${baseUrl}/user/profile-image`,data,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                        "Content-Type": 'multipart/form-data'
                    }
                }
            );
            
            return response;
        }catch(error){
            return error.response;
        }
    },
    getUserImage:async (token) =>{  
        try{
            const response = await axios.get(`${baseUrl}/user/profile-image`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
            );
            
            return response;
        }catch(error){
            return error.response;
        }
    },    
    updateUserPassword:async (data,token) =>{  
        try{
            const response = await axios.put(`${baseUrl}/user/password`,data,
                {
                    headers:{
                        Authorization:`Bearer ${token}`,
                    }
                }
            );
            
            return response;
        }catch(error){
            return error.response;
        }
    },
}