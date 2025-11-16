import React, { useState } from 'react'
import SignupBox from './SignupBox.jsx';
import LoginBox from './LoginBox.jsx';

const NavBar = () => {
  const [signupbox, setsignupbox] = useState(false);
  const [loginbox, setloginbox] = useState(false);

  return (
    <>
      <header className='w-full h-[60px] flex relative text-gray-100 text-shadow-gray-800 '>
        <div className=' text-2xl w-[150px] h-full absolute left-[100px] flex items-center justify-center'>
          <span>Soul Sync</span>
        </div>

        <div className='absolute  left-[350px] w-[300px] h-full flex items-center justify-center'>
          <ul className=' text-sm flex gap-7 '>
            <li className='underline underline-offset-4 cursor-pointer hover:text-amber-800'>HOME</li>
            <li className='cursor-pointer hover:text-amber-800'>ABOUT</li>
            <li className='cursor-pointer hover:text-amber-800'> FAQ</li>
            <li className='cursor-pointer hover:text-amber-800'>CONTACTS</li>
          </ul>
        </div>

        <div className='absolute right-[100px] w-[170px] h-full flex items-center justify-center gap-5'>
          <button
            className='font-bold cursor-pointer transition-all hover:text-amber-800'
            onClick={() => {
              setloginbox(true);
              setsignupbox(false);
            }}
          >
            Sign In
          </button>

          <button
            className='font-bold px-4 py-2 rounded-sm text-amber-600 bg-white cursor-pointer
            hover:text-amber-900 hover:opacity-60 transition-all'
            onClick={() => {
              setsignupbox(true);
              setloginbox(false);
            }}
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* ✅ Render modals outside navbar */}
      {loginbox && <LoginBox />}
      {signupbox && <SignupBox />}
    </>
  )
}

export default NavBar
