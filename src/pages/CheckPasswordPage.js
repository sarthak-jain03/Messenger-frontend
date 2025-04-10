import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: '',
    userId: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get user from location.state or localStorage
  const user = location?.state || JSON.parse(localStorage.getItem('loginUser'));

  useEffect(() => {
    if (!user?.name || !user?._id) {
      navigate('/email');
      return;
    }

    setData(prev => ({
      ...prev,
      userId: user._id
    }));
  }, [user, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios.post(URL, {
        userId: data.userId,
        password: data.password
      }, {
        withCredentials: true
      });

      toast.success(response.data.message);

      if (response.data.success) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          profile_pic: response.data.profile_pic,
          token: response.data.token
        };

        dispatch(setToken(userData.token));
        dispatch(setUser(userData));
        localStorage.setItem('token', userData.token);

        // Clean up temporary user storage
        localStorage.removeItem('loginUser');

        setData({
          password: '',
          userId: ''
        });

        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 mx-auto'>
        <div className='flex justify-center items-center flex-col'>
          <Avatar
            name={user?.name}
            imageUrl={user?.profile_pic}
            width={120}
            height={120}
          />
        </div>
        <h3 className='flex justify-center items-center mt-6 text-xl font-bold'>Welcome to Messenger!</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Enter your password'
              className='bg-slate-100 px-4 py-2 focus:outline-purple-900'
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type='submit'
            className='bg-purple-600 text-lg px-4 py-1 hover:bg-purple-900 rounded mt-2 text-white font-bold leading-relaxed tracking-wide'>
            Login
          </button>
        </form>

        <p className='my-2 text-center'>
          <Link to={"/forgot-password"} className='hover:text-purple-400 font-semibold'>
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
