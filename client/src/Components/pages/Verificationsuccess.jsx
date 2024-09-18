import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'
const Verificationsuccess = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="bg-white p-12 rounded-lg shadow-lg inline-block">
        <div className="rounded-full h-52 w-52 bg-gray-100 mx-auto flex items-center justify-center">
          <i className="text-green-400 text-9xl leading-[200px]">✓</i>
        </div>
        <h1 className="text-green-500 font-bold text-4xl mt-5">Success</h1>

        <p className="text-gray-700 font-medium text-xl mt-2">
          Email Verified Successfully<br /><br />
          <div className=' flex items-center content-center justify-items-center justify-center '>
          <Link to={'/login'}><button className='bg-blue-500 p-4 rounded-lg '> Login </button></Link>
          </div>
           
        </p>
      </div>
    </div>
  )
}

export default Verificationsuccess
