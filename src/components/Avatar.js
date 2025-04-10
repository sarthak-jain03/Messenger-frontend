import React from 'react'
import { FaUser } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Avatar = ({userId, name, imageUrl, width, height}) => {

  const onlineUser = useSelector(state => state?.user?.onlineUser)

  // Sarthak Jain = SJ
  let avatarName = ""
  if (name){
    const splitName = name.split(" ")
    if (splitName.length > 1){
      avatarName = splitName[0][0] + splitName[1][0]
    }
    else{
      avatarName = splitName[0][0]
    }
  }

  const bgColor = [
    'bg-red-200',
    'bg-gray-200',
    'bg-orange-200',
    'bg-amber-200',
    'bg-lime-200',
    'bg-green-200',
    'bg-teal-200',
    'bg-blue-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-rose-200',
    'bg-slate-200'
  ]

  const randomNumber = Math.floor(Math.random()*12)

  const isOnline = onlineUser.includes(userId)

  return (
    <div  style={{width: width+"px", height: height+"px"}}
     className={` rounded-full relative overflow-hidden
      shadow flex justify-center`}>
        {
            imageUrl ? (
              <img className='object-cover object-top'
              src={imageUrl}
              width={width}

              height={height}
              alt={name}/>
            ) : (
              name ? (
                <div style={{width: width+"px", height: height+"px"}}
                 className={`overflow-hidden rounded-full border flex 
                 justify-center items-center text-2xl font-bold font-sans ${bgColor[randomNumber]}`}>
                  {avatarName}
                  </div>
                
              ) : (
                <FaUser
                size={width}/>
                
              )
            )
        }
        {
          isOnline && (
            <div className='bg-green-600 p-1 absolute bottom-2 right-1 z-10 rounded-full'></div>
          )
        }
    </div>
    
  )
}

export default Avatar
