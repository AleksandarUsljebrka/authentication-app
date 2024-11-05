import axios from "axios";
import { baseUrl } from "../config/config";

export const AuthService = {
    login:async (data) =>{  
        try{
            const response = await axios.post(`${baseUrl}/auth/login`,data);
            
            return response;
        }catch(error){
            console.log(error.response);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    },
    register:async (data) =>{
        try {
            const response = await axios.post(`${baseUrl}/auth/register`, data);
            return {
                status: 'success',
                data: response.data
            };
        } catch (error) {
            return error.response;
           
        }
    }
   
}