import React from 'react'
import googleIcon from '../assets/google.png';

const GoogleButton = ({onClick}) => {
  return (
    <button onClick={onClick}
    className='mt-2 border border-gray-500 bg-gray-200 hover:bg-gray-400 transition-all duration-200 rounded-md w-full h-11 flex justify-center items-center'>
        <img src={googleIcon} alt="Icon" className='w-6 h-6 mr-3' />
        <p>
            Google Log in
        </p>
    </button>
  )
}

export default GoogleButton