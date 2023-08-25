import React, { useContext } from 'react'
import './Typing.css'
import GlobalContext from '../../context/GlobalContext'
export default function Typing(props) {
  const {typing} = useContext(GlobalContext)
  return (
    <>
      {
        typing?
        <div className='w-full flex items-center justify-center my-2'>
            <div className='w-[95%] flex justify-start'>
                <div className='w-16 h-12 rounded-3xl bg-primary-color text-primary-complementary flex items-center justify-center px-4'>
                    <div className="typing">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>  
            </div>
        </div>
        :null
      }
    </>

  )
}
