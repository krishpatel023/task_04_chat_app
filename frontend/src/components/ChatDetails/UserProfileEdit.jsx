import React from 'react'
import IMG from '../../assets/grp_chat.jpg'
import axios from 'axios'
import { config,backendURL } from '../../utils/utils'
import Button from '@mui/joy/Button';
import { useState, useEffect } from 'react';
import UserImage from '../Image/UserImage';
export default function UserProfileEdit(props) {

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
    useEffect(()=>{
        if(props.admin){
          decideAdmin()      
          console.log(props.admin);            
        }

      },[props.admin])
    const decideAdmin = ()=>{
        for(var i =0; i < props.admin.length; i++){
            if(props.userId === props.admin[i]){
                setIsAdmin(true)
                break;
            }
            else{
                setIsAdmin(false)
            }
        }
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
                    isAdmin ?
                    <Button type="submit"
                    variant="soft" color="danger"
                        onClick={()=>props.deleteAdmin(props.userId)}
                    >Remove Admin</Button>
                    :
                    <Button
                    color="success"
                        variant="soft"
                        onClick={()=>props.addAdmin(props.userId)}
                    >Make Admin</Button>

                }
                <Button
                    color="danger"
                        variant="soft"
                        onClick={()=>{props.deleteMembers(props.userId);props.deleteAdmin(props.userId)}}
                >Remove User</Button>
                </div>
        </div>

        :
        null
        }
    </>
  )
}
