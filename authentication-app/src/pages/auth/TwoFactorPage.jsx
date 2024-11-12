import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/authContext';
import { AuthService } from '../../services/AuthService';

const TwoFactorPage = () => {
    const [token, setToken] = useState('');
    const {verify2FAToken} = AuthService;
    const navigate = useNavigate();
    const {handleLogin, email} = useAuth();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await verify2FAToken(token,email);
            if (response.status === 200) {
                toast.success("2FA successful!");
                await handleLogin(response.data);

                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error("Invalid 2FA code. Try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className='min-h-screen p-56 flex flex-col  items-center '>
            <h2 className='text-2xl md:text-4xl mb-14'>Enter Your 2FA Code</h2>
            <form onSubmit={handleSubmit}
            className='flex flex-col items-start shadow-md border border-black py-10 px-10 rounded-xl bg-gray-300'>
                <input 
                className='mb-4 p-3'
                    type="text" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    placeholder="Enter your 2FA code" 
                    required
                />
                <Button type="submit"
                    buttonText="Verify"
                    className="w-20"
                />
            </form>
            
        </div>
    );
};

export default TwoFactorPage;
