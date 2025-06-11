import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout, setOnlineUser, setUser, setSocketConnection } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../Assets/logo.png'
import io from 'socket.io-client'
import toast from 'react-hot-toast';

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loadingUserSession, setLoadingUserSession] = useState(true);

  console.log("user",user)

  const fetchUserDetails = async() =>{
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const response = await axios({
        method: "get",
        url: URL,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.data.success && response.data.user) { // Expecting 'user' key from backend
          dispatch(setUser(response.data.user));
      } else {
          console.warn("User details fetch: Backend returned success false or missing user data.");
          dispatch(logout());
          localStorage.removeItem('token');
          navigate("/email");
      }
     
      console.log("Current user details response:",response)

    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.response && error.response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
      } else if (error.message === "Network Error") {
          toast.error("Network error. Please check your internet connection.");
      } else {
          toast.error("Failed to load user session. Please try again.");
      }
      dispatch(logout());
      localStorage.removeItem('token');
      navigate("/email");
    } finally {
        setLoadingUserSession(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
        fetchUserDetails();
    } else {
        setLoadingUserSession(false);
        const publicRoutes = ['/email', '/password', '/register', '/forgot-password'];
        if (!publicRoutes.includes(location.pathname)) {
             navigate("/email");
        }
    }
  }, []);


  // SOCKET CONNECTIONS
  useEffect(()=>{
    if (user._id && !loadingUserSession) {
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
            auth: {
                token: localStorage.getItem("token")
            },
        });

        socketConnection.on("onlineUser",(data) => {
            console.log("Online Users:", data);
            dispatch(setOnlineUser(data));
        });

        dispatch(setSocketConnection(socketConnection));

        return () => {
            socketConnection.disconnect();
            dispatch(setSocketConnection(null));
        };
    }
  },[user._id, loadingUserSession, dispatch]);

  const basePath = location.pathname === '/'

  if (loadingUserSession) {
      return (
          <div className='flex justify-center items-center h-screen'>
              Loading application...
          </div>
      );
  }

  return (
    <div className='grid lg:grid-cols-[400px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>

      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>
      
      <div className= {`justify-center items-center flex-col gap-2 ${!basePath ? "hidden" : "flex"} `}>
        <div>
          <img src={logo}
          alt='logo'
          width={170}
          height={80}>
          </img>
        </div>
        <p className='text-lg mt-2 font-bold'>Start a New Conversation</p>
      </div>
    </div>
  )
}

export default Home;