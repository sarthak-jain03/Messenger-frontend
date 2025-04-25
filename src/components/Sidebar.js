import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { SiMessenger } from "react-icons/si";
import { IoPersonAddSharp } from "react-icons/io5";
import Avatar from './Avatar';
import { BiLogOut } from "react-icons/bi";
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import SearchUser from './SearchUser';
import { useDispatch } from 'react-redux';
import { FaRegImage } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import {logout} from '../redux/userSlice'

const Sidebar = () => {
    const user = useSelector(state => state.user)

    //Edit User Details
    const [editUserOpen, setEditUserOpen] = useState(false)
    
    const [allUsers, setAllUsers] = useState([])
    const [openSearchUser, setOpenSearchUser] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const socketConnection = useSelector(state => state?.user?.socketConnection)

    useEffect(()=>{
      if(socketConnection){
          socketConnection.emit('sidebar',user._id)
          
          socketConnection.on('conversation',(data)=>{
              console.log('conversation',data)
              
              const conversationUserData = data.map((conversationUser,index)=>{
                  if(conversationUser?.sender?._id === conversationUser?.receiver?._id){
                      return{
                          ...conversationUser,
                          userDetails : conversationUser?.sender
                      }
                  }
                  else if(conversationUser?.receiver?._id !== user?._id){
                      return{
                          ...conversationUser,
                          userDetails : conversationUser.receiver
                      }
                  }else{
                      return{
                          ...conversationUser,
                          userDetails : conversationUser.sender
                      }
                  }
              })

              setAllUsers(conversationUserData)
          })
      }
  },[socketConnection,user])

  const handleLogout = () => 
    {
    localStorage.removeItem("token");
    dispatch(logout())
    navigate('/email')
  }

  return (
    <div className='h-full w-full grid grid-cols-[48px,1fr] bg-white'>
        <div className='bg-slate-200 h-full w-16 rounded-tr-lg rounded-br-lg
          flex flex-col justify-between pt-6'>
            <div>
                <NavLink className={ ({isActive}) =>`w-16 h-16 flex justify-center items-center
                 cursor-pointer hover:bg-slate-300 rounded ${isActive && "bg-slate-200"}`}
                 title='Chats'>
                    <SiMessenger
                    size={36}/>
                </NavLink>

                <div title='Add Friend' onClick={()=> setOpenSearchUser(true)} className='w-16 h-16 flex justify-center items-center
                cursor-pointer hover:bg-slate-300 rounded'>
                    <IoPersonAddSharp
                    size={36} />
                </div>
            </div>

            <div className='flex flex-col justify-center items-center pb-1'>
                <button className='w-16 h-16 flex justify-center items-center
                cursor-pointer hover:bg-slate-300 rounded' title={user?.name} onClick={() => setEditUserOpen(true)}>
                    <Avatar
                    width={45}
                    height={45}
                    name={user?.name} 
                    imageUrl={user?.profile_pic}
                    userId={user?._id}/>
                </button>
                <button className='w-16 h-16 flex justify-center items-center
                cursor-pointer hover:bg-slate-300 rounded mr-2' title='Logout' onClick={handleLogout}>
                    <BiLogOut
                    size={36} />
                </button>
            </div>
        </div>

        <div className='w-full p-5'>
        <div className='flex items-center h-12'>
          <h2 className='text-xl font-bold p-4 text-slate-800'>Messages</h2>
        </div>

        <div className='bg-slate-200 p-[0.5px]'></div>

        <div className='h-[calc(100vh-65px) overflow-x-hidden overflow-y-auto scrollbar'>
          {
            allUsers.length === 0 && (
              <div className='flex flex-col justify-center items-center p-9 mt-20'>
                <p className='text-lg text-center text-slate-400'>Explore Users to start a conversation with.</p>
                <div title='Add Friend' onClick={()=> setOpenSearchUser(true)} className='w-200 h-20 flex justify-center items-center text-slate-400
                cursor-pointer hover:text-slate-900'>
                    <IoPersonAddSharp
                    size={40} />
                </div>
              </div>
            )
          }

          {
            allUsers.map((conv, index) => {
              return(
                <NavLink to={'/'+conv?.userDetails?._id} key={conv?._id} className='flex items-center gap-3 py-3 px-2 border-b hover:bg-slate-100 cursor-pointer'>
                  <div>
                    <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={50}
                    height={50}
                    />
                  </div>
                  <div>
                    <h3 className='font-semibold text-ellipsis line-clamp-1'>{conv?.userDetails?.name}</h3>
                    <div className='text-slate-500 text-sm flex items-center gap-1'> 
                      <div className='flex items-center gap-1'>
                        {
                          conv?.lastMsg.imageUrl && (
                            <div className='flex items-center gap-1'>
                              <span><FaRegImage/></span>
                              {!conv.lastMsg.text && <span>Image</span>}
                            </div>
                          )
                        }
                        {
                          conv?.lastMsg.videoUrl && (
                            <div className='flex items-center gap-1'>
                              <span><IoVideocam/></span>
                              {!conv.lastMsg.text && <span>Video</span>}
                            </div>
                          )
                        }
                      </div>
                      
                      {
                        conv?.lastMsg?.text.length > 27 ? <p className='text-ellipsis line-clamp-1 max-w-[210px]'>{conv?.lastMsg?.text.substr(0,27)+"....."}</p> : <p className='text-ellipsis line-clamp-1 max-w-[210px]'>{conv?.lastMsg?.text}</p>
                      }
                  
                    </div>
                  </div>
                  {
                    Boolean(conv?.unseenMsg) && (
                      <p className='text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-green-500 text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                    )
                  }
                </NavLink>
              )
            })
          }
        </div>
      </div>

        {/* Edit User Details  */}
        {
            editUserOpen && (
                <EditUserDetails onClose={() => setEditUserOpen(false)} user={user}/>
            )
        }

        {/* Search User  */}
        {
          openSearchUser && (
            <SearchUser onClose={() => setOpenSearchUser(false)}/>
          )
        }
    </div>
    
  )
}

export default Sidebar
