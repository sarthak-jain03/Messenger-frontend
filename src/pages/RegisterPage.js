import React, {useState} from 'react'
import { GrClose } from "react-icons/gr";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  })

  const [uploadPhoto, setUploadPhoto] = useState("")
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

  const handleUploadPhoto = async(e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)
    
    setUploadPhoto(file)

    setData((prev) => {
      return{
        ...prev,
        profile_pic: uploadPhoto?.url
      }
    })
    
  }

  const handleClearPhoto = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadPhoto(null)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("data",data)

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

    try {
      const response = await axios.post(URL, data)
      console.log("response", response)
      toast.success(response.data.message)

      if (response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        })
        navigate("/email")
      }

    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5 '>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-5 mx-auto'>
        <h3 className='flex justify-center items-center text-xl font-bold'>Welcome to SignalBridge!</h3>
        
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          {/*  NAME  */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name </label>
            <input
            type='text'
            id='name'
            name='name'
            placeholder='Enter your Name'
            className='bg-slate-100 px-4 py-2 focus:outline-purple-900'
            value={data.name}
            onChange={handleOnChange}
            required/>
          </div>

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

          {/* PASSWORD  */}
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

          {/* PROFILE PIC */}
          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic'>Photo 

              <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-purple-900 cursor-pointer'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {
                    uploadPhoto?.name ? uploadPhoto?.name : "Upload Profile Photo"
                  }
                  </p>
                  {
                    uploadPhoto?.name && (
                      <button className='text-sm ml-2 hover:text-red-600' onClick={handleClearPhoto}>
                        <GrClose/>
                      </button>
                    )
                  }        
              </div>
            </label>
            <input
            type='file'
            id='profile_pic'
            name='profile_pic'
            className='bg-slate-100 px-4 py-1 focus:outline-purple-900 hidden'
            onChange={handleUploadPhoto}
            />
          </div>

        
            <button
            className='bg-purple-600 text-lg px-4 py-1 hover:bg-purple-900 rounded mt-2 text-white
            font-bold leading-relaxed tracking-wide'>
              Register
            </button>
         
        </form>

        <p className='my-2 text-center'>Already have an account ? <Link to={"/email"}
        className='hover:text-purple-400 font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage
