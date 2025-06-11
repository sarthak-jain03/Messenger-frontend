import React, {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import {setToken, setUser}  from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // --- START: Fetch user data persistently using localStorage as fallback ---
  const userId = location?.state?._id || localStorage.getItem('tempUser_id');
  const userName = location?.state?.name || localStorage.getItem('tempUserName');
  const userProfilePic = location?.state?.profile_pic || localStorage.getItem('tempUserProfilePic');
  // --- END: Fetch user data persistently ---


  useEffect(() => {
    // If userName or userId is missing (even from localStorage), redirect to email
    if (!userName || !userId){
      navigate("/email");
    }
  },[userName, userId, navigate]); // Dependencies added for useEffect

  const handleOnChange = (e) => {
    const {name, value} = e.target
    setData((prev) => {
      return{
        ...prev,
        [name] : value
      }
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    e.stopPropagation()

    // Ensure we have userId before sending the request
    if (!userId) {
        toast.error("User ID is missing. Please go back to the email page and try again.");
        navigate("/email");
        return;
    }

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: userId, // Use the user ID from the persistent source
          password: data.password
        },
        withCredentials: true
      })
      toast.success(response.data.message)

      if(response.data.success){
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)

        // --- START: CRUCIAL ADDITION FOR REDUX STATE ---
        // Ensure your backend's /api/password response includes the full user object
        // e.g., { message: "Login successful", success: true, token: "...", user: { _id, name, email, profile_pic } }
        if (response?.data?.user) { // Assuming backend sends 'user' key
            dispatch(setUser(response.data.user)); // Populate full user details in Redux
        } else {
            console.warn("Backend did not return full user data on password check. Redux user state might be incomplete.");
        }
        // --- END: CRUCIAL ADDITION ---

        // Clear temporary user data from localStorage as the user is now authenticated
        localStorage.removeItem('tempUser_id');
        localStorage.removeItem('tempUserName');
        localStorage.removeItem('tempUserProfilePic');

        setData({
          password : "",
        });
        navigate('/'); // Navigate to the chat section
    }

    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred during login.");
      console.error("Login error:", error); // Log the full error for detailed debugging
    }
  }

  return (
    <div className='mt-5 '>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 mx-auto'>
        <div className='flex justify-center items-center flex-col'>
          <Avatar
          name={userName} // Use the persisted name
          imageUrl={userProfilePic} // Use the persisted profile pic
          width={120}
          height={120}/>
        </div>
        <h3 className='flex justify-center items-center mt-6 text-xl font-bold'>Welcome to Messenger!</h3>
        
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          
          {/* PASSWORD  */}
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
            required/>
          </div>
        
            <button
            className='bg-purple-600 text-lg px-4 py-1 hover:bg-purple-900 rounded mt-2 text-white
            font-bold leading-relaxed tracking-wide'>
              Login
            </button>
         
        </form>

        <p className='my-2 text-center'><Link to={"/forgot-password"}
        className='hover:text-purple-400 font-semibold'>Forgot Password ?</Link></p>
      </div>
     </div>
  )
}

export default CheckPasswordPage