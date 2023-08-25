import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { config, backendURL } from '../../../utils/utils'
import GlobalContext from '../../../context/GlobalContext'
export default function MessageComponent(props) {

  const [dataBase,setDataBase]=useState()
  const [role,setRole]=useState()
  const getMsg = async()=>{
    const data = await axios.get(`${backendURL}/api/messages/${props.messageId}`, config)
    setDataBase(data.data)
    decideRole(data.data.senderId)

  }

  const decideRole = async(myId)=>{
    if(myId === props.userId){
      setRole("sender")
    }
    else{
      setRole("receiver")
    }
  }

  useEffect(()=>{
    if(props.messageId){
      getMsg()
    }
  },[])

  return (
    <>
    {
      role?
      <div className='w-full min-h-12 flex justify-center my-2'>
        {
            role === 'sender'?
            <div className='w-[95%] flex justify-end'>
              <div className='max-w-[30rem]  min-h-12 rounded-3xl bg-accent-color text-accent-complementary flex items-center px-4 py-2'>
                <span>{dataBase.data}</span>
              </div>
            </div>  
            :
            <div className='w-[95%] flex justify-start'>
              <div className='max-w-[30rem]  min-h-12 rounded-3xl bg-primary-color text-primary-complementary flex items-center px-4 py-2'>
                  <span>{dataBase.data}</span>
              </div>  
            </div>      

        }
      </div>
      :
      null
    }
    </>
  )
}
