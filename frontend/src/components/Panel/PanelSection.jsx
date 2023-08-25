import React, { useContext, useEffect } from 'react'
import Input from '@mui/joy/Input';

import GrpChat from '../../assets/grp_chat.jpg'
import DirectMessageComponent from './DirectMessageComponent';
import Button from '@mui/joy/Button/Button';
import GlobalContext from '../../context/GlobalContext';
import BasicModalDialog from '../../pages/Modal';
import ChatCreation from '../../pages/ChatCreation';

export default function PanelSection() {

    const {setOpen, user, setCreateChatBox} = useContext(GlobalContext)

    useEffect(()=>{

    },[user])
  return (
    <>

   <BasicModalDialog/>
   <ChatCreation/>
    <div className='w-full h-full bg-primary-color flex flex-col items-center'>
        <div className="w-[90%] mt-4">
            {
                user?
                <div className='w-full flex flex-col items-center rounded-lg bg-accent-color text-accent-complementary'>
                    <span className='font-bold'>{user.name}</span>
                    <span>{user.email}</span>
                </div>
                :
                <Button className='w-full flex gap-2' onClick={()=>setOpen(true)}>
                    <i className="fa-solid fa-plus"></i>
                    Add User
                </Button>
                
            }
        </div>
        <div className="w-[90%] mt-4">
                <Button className='w-full flex gap-2' onClick={()=>setCreateChatBox(true)}>
                    <i className="fa-solid fa-plus"></i>
                    Create Chat
                </Button>


            {/* <Input
                color="neutral"
                placeholder="Search"
                size="lg"
                variant="soft"
            /> */}
        </div>
        {/* DIRECT MESSAGES */}
        <div className='w-[90%]  mt-4'>
            <h1 className='font-semibold w-full'>DIRECT MESSAGES</h1>
            {
                user?
                user.chats?.map((data,i)=>
                <DirectMessageComponent
                    img = {GrpChat}
                    key={i}
                    chatId = {data}
                    currentUserId = {user.userID}
                />
                )
                :null
            }
        </div>
    </div>
    </>
  )
}
