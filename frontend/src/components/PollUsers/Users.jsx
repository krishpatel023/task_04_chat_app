import React, { useEffect, useState } from 'react'
import UserImage from '../Image/UserImage'
import axios from 'axios'
import { config, backendURL } from '../../utils/utils'
export default function Users({userId}) {

    const [dataBase, setDataBase] = useState()
    const getUsers = async () => {
        const data = await axios.get(`${backendURL}/api/users/${userId}`,config)
        setDataBase(data.data)
        console.log("VOTED USER" , data.data);
        console.log("VOTED USER ID" , userId);

    }
    useEffect(()=>{
        if(userId){
            getUsers()           
        }

    },[])
  return (
    <>
        {
            dataBase?
                <div className='w-48 h-14 flex gap-2'>
                    <div className='w-14 h-14 rounded-full flex justify-center items-center'>
                        <UserImage userId={userId}/>
                    </div>
                    <div className='flex justify-center items-center text-center'>
                        <h1>{dataBase.name}</h1>
                    </div>
                </div>
            : 
            null
        }
    </>

  )
}
