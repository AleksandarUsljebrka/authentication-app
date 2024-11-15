import axios from "axios";
import { baseUrl } from "../config/config";

export const AuthService = {
    login:async (data) =>{  
        try{
            const response = await axios.post(`${baseUrl}/auth/login`,data);
            
            return response;
        }catch(error){
            return error.response;
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
    },
    googleLogin:async (data) =>{  
        try{
            const response = await axios.post(`${baseUrl}/auth/google-login`,{
                code:data
            },
                {
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
            );
            
            return response;
        }catch(error){
            return error.response;
        }
    },
    verifyEmailRequest:async (token,email) =>{
        try {
            const response = await axios.post(`${baseUrl}/auth/verify-email`,{
                token:token,
                email:email
            });
            return response;
        } catch (error) {
            return error.response;
           
        }
    },
    verify2FAToken:async (token, email) =>{
        try {
            const response = await axios.post(`${baseUrl}/auth/verify-2fa`,{
                token,
                email
            });
            return response;
        } catch (error) {
            return error.response;
           
        }
    },
       
}