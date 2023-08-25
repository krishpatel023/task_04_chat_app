import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../../context/GlobalContext'
import { config, backendURL } from '../../utils/utils'
import axios from 'axios'
import DefaultImg from '../../assets/Default.jpg'

export default function UserImage({userId}) {

    const [IMG, setIMG] = useState()
    const getUserData = async(id)=>{
      const data = await axios.get(`${backendURL}/api/users/${id}`,config)
      if(data.data?.img){
        const res = await axios.get(`${backendURL}/api/files/download/${data.data.img}`, { responseType: "blob" })
        const blob = new Blob([res.data], { type: res.data.type });
        setIMG(window.URL.createObjectURL(blob))
      }
    }
    
    useEffect(()=>{
        if(userId){
            getUserData(userId)
        }
    },[])

  return (
    <>
      {
        IMG?
        <img className='w-full h-full rounded-full' src={IMG} alt="" />
        :
        <img className='w-full h-full rounded-full' src={DefaultImg} alt="" />
      }
    </>
  )
}
