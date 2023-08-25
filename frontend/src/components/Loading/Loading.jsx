import React, { useContext } from 'react'
import './Loading.css'
import GlobalContext from '../../context/GlobalContext'
import Skeleton from '@mui/joy/Skeleton';

export default function Loading() {
    const {loading} = useContext(GlobalContext)
  return (
    <>
    {
        loading?
        <div className='w-[75%] h-[80%] absolute top-[10%] flex justify-center items-center bg-secondary-color'>
            <div className="container">
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
                <div className="ball"></div>
            </div>   
        </div>        
        :null
    }
    </>
  )
}
