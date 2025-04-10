import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`;

    try {
      const response = await axios.post(URL, { email });
      toast.success(response.data.message);
      setEmail('');

      // Optionally redirect to login page after few seconds
      setTimeout(() => navigate('/email'), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 mx-auto'>
        <div className='flex justify-center items-center flex-col'>
          <img
            src='https://pictarts.com/03/material/04-relationship/0365-image-illust-m.png'
            alt='Forgot Password'
            className='w-[180px] h-[120px]'
          />
        </div>
        <h3 className='flex justify-center items-center mt-6 text-xl font-bold'>
          Forgot Your Password?
        </h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          {/* EMAIL INPUT */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your registered email'
              className='bg-slate-100 px-4 py-2 focus:outline-purple-900'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className='bg-purple-600 text-lg px-4 py-1 hover:bg-purple-900 rounded mt-2 text-white
            font-bold leading-relaxed tracking-wide'
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
