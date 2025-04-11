import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: ""
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password
        },
        withCredentials: true
      });

      toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        dispatch(setUser({
          _id: response?.data?._id,
          name: response?.data?.name,
          email: response?.data?.email,
          profile_pic: response?.data?.profile_pic || ""
        }));

        localStorage.setItem('token', response?.data?.token);

        setData({ password: "" });

        // ✅ Redirect to /userId
        navigate(`/${response?.data?._id}`);
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
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
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
