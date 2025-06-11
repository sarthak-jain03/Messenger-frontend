import React, { useEffect } from 'react'
import axios from 'axios';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { logout, setOnlineUser, setUser, setSocketConnection } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import logo from '../Assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  // console.log("redux user", user)

  console.log("user",user)
  const fetchUserDetails = async() =>{
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
      const response = await axios({
        method: "get",
        url: URL,
        withCredentials: true
      })

      dispatch(setUser(response.data.data))

      if (response.data.data.logout){
        dispatch(logout())
        navigate("/email")
      }
      
      console.log("Current user details",response)

    } catch (error) {
      console.log("Error", error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])




  // SOCKET CONNECTIONS 
  useEffect(()=>{
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth: {
        token: localStorage.getItem("token")
      },
    })
    
    socketConnection.on("onlineUser",(data) => {
      console.log(data)
      dispatch(setOnlineUser(data))
    })
    dispatch(setSocketConnection(socketConnection))

    return ()=>{
      socketConnection.disconnect()
    }
  },[])



  const basePath = location.pathname === '/'

  return (
    <div className='grid lg:grid-cols-[400px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>

      {/* Message Component  */}
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

export default Home
