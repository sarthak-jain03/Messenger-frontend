import React from 'react'
import logo from '../Assets/logo.png'
const AuthLayouts = ({children}) => {
  return (
    <>
    <header className='flex justify-center items-center py-3 '>
      <div>
      <img src={logo}
        alt='logo'
        width={110}
        height={45}>
        </img>
      </div>
      
    </header>

    {children}
    </>
  )
}

export default AuthLayouts
