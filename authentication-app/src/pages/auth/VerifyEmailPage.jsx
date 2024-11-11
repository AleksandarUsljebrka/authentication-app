
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/AuthService';


const VerifyEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const {verifyEmailRequest} = AuthService;

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        const email = queryParams.get('email');

        if (token && email) {
            verifyEmail(token, email);
        } else {
            setStatus('Invalid link or missing parameters.');
            setLoading(false);
        }
    }, [location]);

    const verifyEmail = async (token, email) => {
        setLoading(true);
        try {
            const encodedToken = encodeURIComponent(token);
            const encodedEmail = encodeURIComponent(email);

            const response = await verifyEmailRequest(encodedToken, encodedEmail);
            console.log(response);
            
            if (response.status <300 &&  response.status >= 200) {
                setStatus('Email successfully verified!');
                setLoading(false);

                setTimeout(() => navigate('/login'), 3000);
            }else if(response.status!==0){
                setLoading(false);
                setStatus("Error: Email is possibly expired!")
            }
        } catch (error) {
            setStatus('Network error. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className='pt-20 min-h-screen flex justify-center items-center font-semibold text-4xl'>
            <div className=''>
            {loading ? <p>Verifying email...</p> : <p>{status}</p>}

            </div>
        </div>
    );
};

export default VerifyEmailPage