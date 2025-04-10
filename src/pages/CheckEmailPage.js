import React, {useState} from 'react'
import { GrClose } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser } from "react-icons/fa";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  })

  const navigate = useNavigate()

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
    console.log("data",data)

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
      const response = await axios.post(URL, data)
      toast.success(response.data.message)

      if (response.data.success){
        setData({
          email: "",
        })
        navigate("/password", {
          state: response?.data?.data
        })
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5 '>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 mx-auto'>
        <div className='flex justify-center items-center'>
          <FaUser
          size={120}
          className='rounded-full shadow'/>
        </div>
        <h3 className='flex justify-center items-center mt-6 text-xl font-bold'>Welcome to Messenger!</h3>
        
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          

          {/* EMAIL  */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Email </label>
            <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your Email'
            className='bg-slate-100 px-4 py-2 focus:outline-purple-900'
            value={data.email}
            onChange={handleOnChange}
            required/>
          </div>
        
            <button
            className='bg-purple-600 text-lg px-4 py-1 hover:bg-purple-900 rounded mt-2 text-white
            font-bold leading-relaxed tracking-wide'>
              Let Go!
            </button>
         
        </form>

        <p className='my-2 text-center'>New User ? <Link to={"/register"}
        className='hover:text-purple-400 font-semibold'>Register</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage
