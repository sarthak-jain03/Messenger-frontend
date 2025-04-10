import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    newPassword: ''
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/reset-password/${token}`
    
    if (!data.newPassword) {
      return toast.error('Please enter a new password');
    }
    if (data.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
  
    try {
      const response = await axios.post(URL, {
        newPassword: data.newPassword
      });
      
      toast.success(response.data.message);
      setData({ newPassword: '' });
  
      setTimeout(() => navigate('/email'), 1500);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };
  

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 mx-auto'>
        <div className='flex justify-center items-center flex-col'>
          <img
            src='https://static.thenounproject.com/png/3309848-200.png'
            alt='Reset Password'
            className='w-[140px] h-[130px]'
          />
        </div>
        <h3 className='flex justify-center items-center mt-6 text-xl font-bold'>
          Reset Your Password
        </h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          {/* NEW PASSWORD */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='newPassword'>New Password</label>
            <input
              type='password'
              id='newPassword'
              name='newPassword'
              placeholder='Enter your new password'
              className='bg-slate-100 px-4 py-2 focus:outline-purple-900'
              value={data.newPassword}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className='bg-purple-600 text-lg px-4 py-1 hover:bg-purple-900 rounded mt-2 text-white
            font-bold leading-relaxed tracking-wide'
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
