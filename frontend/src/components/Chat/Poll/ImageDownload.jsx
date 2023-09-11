import React, {  useEffect, useState } from 'react'
import { backendURL } from '../../../utils/utils'
import axios from 'axios'
import DefaultImg from '../../../assets/Default.jpg'

export default function ImageDownload({fileId}) {

    const [IMG, setIMG] = useState()
    const getFileImage = async()=>{
      if(fileId){
        const res = await axios.get(`${backendURL}/api/files/download/${fileId}`, { responseType: "blob" })
        const blob = new Blob([res.data], { type: res.data.type });
        setIMG(window.URL.createObjectURL(blob))
      }
    }
    
    useEffect(()=>{
        
        getFileImage()
        
    },[])

  return (
    <>
      {
        IMG?
        <img className='w-full h-full rounded' src={IMG} alt="" />
        :
        <img className='w-full h-full rounded' src={DefaultImg} alt="" />
      }
    </>
  )
}
