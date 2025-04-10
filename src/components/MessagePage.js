import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import Avatar from './Avatar'
import { HiDotsVertical, HiPlus } from "react-icons/hi"
import { FaAngleLeft } from "react-icons/fa"
import { FaRegImage } from "react-icons/fa6"
import { IoVideocam, IoCloseSharp, IoSend } from "react-icons/io5"
import uploadFile from '../helpers/uploadFile'
import Loading from "../components/Loading"
import wallpaper from "../Assets/wallapaper.jpeg"
import moment from "moment"

const MessagePage = () => {
  const params = useParams()
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user)
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })
  const [loading, setLoading] = useState(false)
  const [allMessage, setAllMessage] = useState([])
  const currentMessage = useRef(null)

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessage])

  const handleOpenImageVideoUploadOpen = () => {
    setOpenImageVideoUpload(prev => !prev)
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return;

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(prev => ({
      ...prev,
      imageUrl: uploadPhoto.url
    }))
  }

  const handleCloseUploadImage = () => {
    setMessage(prev => ({
      ...prev,
      imageUrl: ""
    }))
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]
    if (!file) return;

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(prev => ({
      ...prev,
      videoUrl: uploadPhoto.url
    }))
  }

  const handleCloseUploadVideo = () => {
    setMessage(prev => ({
      ...prev,
      videoUrl: ""
    }))
  }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId)
      socketConnection.emit('seen', params.userId)

      socketConnection.on('message-user', (data) => {
        setDataUser(data)
      })

      socketConnection.on('message', (data) => {
        setAllMessage(data)
      })
    }
  }, [socketConnection, params?.userId, user])

  const handleOnChange = (e) => {
    const { value } = e.target
    setMessage(prev => ({
      ...prev,
      text: value
    }))
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        })
      }
    }
  }

  return (
    <div style={{ backgroundImage: `url(${wallpaper})` }} className='bg-no-repeat bg-cover'>
      {/* HEADER */}
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-5'>
        <div className='flex items-center gap-4'>
          <Link to={'/'} className='lg:hidden'>
            <FaAngleLeft size={20} title='Back' />
          </Link>
          <Avatar
            width={50}
            height={50}
            imageUrl={dataUser.profile_pic}
            name={dataUser.name}
            userId={dataUser._id} />
          <div className='top-1 mt-1 left-16'>
            <h3 className='font-semibold text-lg text-ellipsis line-clamp-1'>{dataUser.name}</h3>
            <p className='-mt-1 text-sm'>
              {
                dataUser.online
                  ? <span className='text-green-500'>online</span>
                  : <span className='text-slate-400'>offline</span>
              }
            </p>
          </div>
        </div>
        <button className='cursor-pointer text-black hover:text-slate-500' title='options'>
          <HiDotsVertical size={25} />
        </button>
      </header>

      {/* MESSAGE DISPLAY AREA */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-40'>
        <div className='flex flex-col gap-2 mx-1' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`bg-white ml-1 p-2 py-1 rounded-lg w-fit max-w-[280px] md:max-w-sm lg:max-w-md
              ${user._id === msg.msgByUserId ? "ml-auto bg-red-300" : ""}`}>
              <div className='w-full'>
                {msg?.imageUrl && (
                  <img src={msg.imageUrl} className='w-full h-full object-scale-down' />
                )}
                {msg?.videoUrl && (
                  <video src={msg.videoUrl} className='w-full h-full object-scale-down' controls />
                )}
              </div>
              <p className='px-2 w-full'>{msg.text}</p>
              <p className='text-xs ml-auto w-fit'>{moment(msg?.createdAt || new Date()).format('HH:mm')}</p>
            </div>
          ))}
        </div>

        {/* IMAGE PREVIEW */}
        {message.imageUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='top-0 right-0 absolute p-3 hover:text-white' onClick={handleCloseUploadImage}>
              <IoCloseSharp size={30} />
            </div>
            <div className='bg-white p-3'>
              <img src={message.imageUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' />
            </div>
          </div>
        )}

        {/* VIDEO PREVIEW */}
        {message.videoUrl && (
          <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
            <div className='top-0 right-0 absolute p-3 hover:text-white' onClick={handleCloseUploadVideo}>
              <IoCloseSharp size={30} />
            </div>
            <div className='bg-white p-3'>
              <video src={message.videoUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay />
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className='w-full h-full flex justify-center items-center absolute text-2xl'>
            <Loading />
          </div>
        )}
      </section>

      {/* SEND MESSAGE SECTION */}
      <section className='h-16 bg-white flex items-center p-4'>
        <div className='relative flex justify-center items-center w-12 h-12 rounded-full hover:bg-red-500 hover:text-white'>
          <div className='relative'>
            <button onClick={handleOpenImageVideoUploadOpen} className='flex justify-center items-center'>
              <HiPlus size={25} />
            </button>

            {openImageVideoUpload && (
              <div className='bg-white shadow rounded absolute bottom-[45px] w-40 p-2 -ml-2'>
                <form>
                  <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200'>
                    <div className='text-red-500'><FaRegImage size={18} /></div>
                    <p className='text-black font-semibold'>Image</p>
                  </label>
                  <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 hover:bg-slate-200'>
                    <div className='text-red-500'><IoVideocam size={18} /></div>
                    <p className='text-black font-semibold'>Video</p>
                  </label>
                  <input type='file' id='uploadImage' onChange={handleUploadImage} className='hidden' />
                  <input type='file' id='uploadVideo' onChange={handleUploadVideo} className='hidden' />
                </form>
              </div>
            )}
          </div>
        </div>

        <form className='h-full w-full flex gap-5' onSubmit={handleSendMessage}>
          <input
            type='text'
            placeholder='Type your Message...'
            className='h-full w-full py-1 px-4'
            value={message.text}
            onChange={handleOnChange}
          />
          <button className='hover:text-red-500' type='submit'>
            <IoSend size={27} />
          </button>
        </form>
      </section>
    </div>
  )
}

export default MessagePage
