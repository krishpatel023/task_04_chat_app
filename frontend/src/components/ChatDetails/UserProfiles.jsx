import React, { useState, useEffect } from 'react'
import IMG from '../../assets/grp_chat.jpg'
import axios from 'axios'
import { config,backendURL } from '../../utils/utils'
import UserImage from '../Image/UserImage'
export default function UserProfiles(props) {
  const [dataBase, setDataBase] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const getUserData = async () => {
    const data = await axios.get(`${backendURL}/api/users/${props.userId}`, config)
    setDataBase(data.data)
  }
  useEffect(()=>{
    if(props.userId && props.admin){
      getUserData()
      decideAdmin()      
    }
  },[])
  const decideAdmin = ()=>{
    props.admin.map((data)=>
      (data === props.userId ? setIsAdmin(true) : null)
    )
  }
  return (
    <>
    {
      dataBase?
    
    <div className='w-full h-20 flex items-center justify-center gap-4 bg-primary-color rounded-lg'>
      <div className='w-12 h-12 rounded-full flex justify-center items-center'>
        <UserImage userId={dataBase.userID}/>
      </div>
      <div className='w-[80%] flex items-center justify-between'>
        <h1 className='font-semibold text-lg'>{dataBase?.name}</h1>
        {
          isAdmin?
          <div className='w-20 text-center rounded bg-accent-color text-accent-complementary'>
            ADMIN
          </div>
          :null
        }
      </div>
    </div>
      :
      null
    }
  </>
  )
}
