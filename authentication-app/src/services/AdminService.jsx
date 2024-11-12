import axios from "axios";
import { baseUrl } from "../config/config";

export const AdminService = {
    getAllUsers:async (token,isVerified, pageNumber,pageSize) =>{  
        try{
            const response = await axios.get(`${baseUrl}/admin/all-users?pageNumber=${pageNumber}&pageSize=${pageSize}&isVerified=${isVerified}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );
            return response;
        }catch(error){
            console.log(error.response);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },
    deleteUser:async (userId, token) =>{  
        try{
            const response = await axios.delete(`${baseUrl}/admin/delete-user?id=${userId}`,
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
    filterUsers:async (data, token) =>{  
        try{
            const response = await axios.post(`${baseUrl}/admin/filter`,data,
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
    searchByEmail:async (email,isVerified, token) =>{  
        try{
            const response = await axios.get(`${baseUrl}/admin/search?email=${email}&isVerified=${isVerified}`,
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
    
    
    
   
}