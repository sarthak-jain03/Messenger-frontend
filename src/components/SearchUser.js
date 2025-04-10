import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import axios from 'axios';
import { IoClose } from "react-icons/io5";

const SearchUser = ({onClose}) => {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const handleSearchUser = async() => {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const response = await axios.post(URL,{
                search : search
            })
            setLoading(false)

           setSearchUser(response.data.data) 

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(()=>{
        handleSearchUser()
    },[search])
    console.log("searchuser", searchUser)
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 z-10'>
        <div className='w-full max-w-md mx-auto mt-10'>
            <div className='bg-white rounded h-10 flex justify-center items-center p-2'>
                <input
                type='text'
                placeholder='Search user by name, email.....'
                className='w-full outline-none py-2 h-full px-4 '
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                />
                
                <div><IoSearchSharp
                size={25}/>
                </div>
            </div>

            {/* display Search User  */}
            <div className='w-full mt-2 bg-white p-4 rounded'>

                {/* No user Found */}
                {
                    searchUser.length === 0 && !loading && (
                        <p className='text-center text-slate-500'>No user found!</p>
                    )
                }
                {
                    loading && (
                        <Loading/>
                    )
                    
                }

                {/* User Found  */}
                {
                    searchUser.length!==0 && !loading && (
                        searchUser.map((user, index) => {
                            return (
                                <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                            )
                        })
                    )
                }
            </div>
        </div>
        <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
            <button>
                <IoClose/>
            </button>
        </div>
      
      
    </div>
  )
}

export default SearchUser
