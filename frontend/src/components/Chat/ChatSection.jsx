// import React from 'react'
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { config, backendURL } from '../../utils/utils';
import GlobalContext from '../../context/GlobalContext';
import ChatDisplay from './ChatDisplay';
import Dropdown from '@mui/joy/Dropdown';
// import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import FileUploadModal from './FileUploadModal';
import Loading from '../Loading/Loading';
import PollCreation from '../../pages/PollCreation';
// import MoreVert from '@mui/icons-material/MoreVert';
export default function ChatSection() {
    const [ typedMsg, setTypedMsg ] = useState()
    
    const { setIsPollOpen, user, currentChat , socketSendMsg , handleTyping, messages, setChatSettings, setDeleteMsg, deleteMsg, handleMsgDelete} = useContext(GlobalContext)
    const sendMsg = async()=>{
        if(currentChat){
            const msgId = await axios.post(`${backendURL}/api/messages/createMsg/${currentChat._id}`,{
                data : typedMsg,
                senderId : user.userID,
                chatId : currentChat._id,
            },config) 
            await currentChat.members.map((data)=> 
                (data !== user.userID ? makeUnreadMessageReq(data) : null)
            )
            console.log("MSGSENT", msgId.data);
            socketSendMsg(msgId.data , "message");
            document.getElementById("msgSender").value= "";
            setTypedMsg("")
        }
    }

    const makeUnreadMessageReq = async(userId)=>{
        console.log(userId, currentChat._id);
        await axios.put(`${backendURL}/api/users/addUnread/${userId}/${currentChat._id}`,{
            chatId : currentChat._id,
            number : 1
        },config) 
    }

    const [uploadedFile, setUploadedFile] = useState(null)

    const handleFileUpload = async (title,description)=>{
        if(uploadedFile){
            const myFile = await axios.post(`${backendURL}/api/files/${currentChat._id}`, {
                file : uploadedFile,
                title : title,
                description : description,
                senderId : user.userID
            }, 
            {
                headers : {'Content-Type': 'multipart/form-data'}
            })
            await currentChat.members.map((data)=> 
            (data !== user.userID ? makeUnreadMessageReq(data) : null)
            )
            console.log("SENT FILE 999999999999999", myFile);
            socketSendMsg(myFile.data, "file");
        }
    }
    const handleInputClick = ()=>{
        document.getElementById('getImg').click()
    }  
    const handleFileInputClick = ()=>{
        document.getElementById('getFile').click()
    }
    const handlePollInput = ()=>{
        setIsPollOpen(true)
    }   
    const [fileSendDialog, setFileSendDialog] = useState( false)
    const changeFunc = (val)=>{
        setFileSendDialog(val)
    }
    useEffect(()=>{
        if(uploadedFile){
            setFileSendDialog(true)
        }
    },[uploadedFile])

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView()
    },[messages])

    const messagesEndRef = useRef()
    const [name,setName]=useState()
    const handleChatName = ()=>{
        if(currentChat.isGroupChat){
            setName(currentChat.chatName)
        }
        else{
            currentChat.members.forEach(member => {
                if(member === user.userID) return;
                getUserData(member)
            })
        }
    }
    const getUserData = async (id)=>{
        const data = await axios.get(`${backendURL}/api/users/${id}`,config)
        setName(data.data.name)
    }

    useEffect(()=>{
        if(user && currentChat){
            handleChatName()
        }
    },[currentChat])

  return (
    <>
    <FileUploadModal
        state={fileSendDialog}
        changeFunc={changeFunc}
        handleFileUpload={handleFileUpload}
    />
    <PollCreation/>
    {
        currentChat?
    
        <div className='w-full h-full'>
            <div className='w-full h-[10%] bg-primary-color flex justify-between'>
                <div className='w-[70%] h-full flex items-center'>
                    <h1 className='font-semibold ml-4'>{ name }</h1>
                </div>
                <div className='w-[30%] h-full flex justify-end items-center'>
                {
                    deleteMsg?
                    <div className='flex gap-4'>
                        <button className='h-10 w-28 flex justify-center items-center rounded gap-2 bg-accent-color text-accent-complementary'
                            onClick={()=>{handleMsgDelete()}}    
                        >
                            <i className="fa-solid fa-trash"></i>
                            Delete
                        </button>
                        <button className='h-10 w-28 mr-4 flex justify-center items-center rounded gap-2 bg-accent-color text-accent-complementary'
                            onClick={()=>{setDeleteMsg(false)}}
                        >
                            <i className="fa-solid fa-xmark"></i>
                            Cancel
                        </button>
                    </div>
                    :null
                }
                {
                    currentChat?.isGroupChat?
                    <button className='h-10 w-20'
                    onClick={()=>setChatSettings(true)}>
                        <span><i className="fa-solid fa-ellipsis-vertical"></i></span>
                    </button>   
                    :
                    null                 
                }

                    
                </div>
            </div>
            <div className='w-full h-[80%] overflow-y-auto'>
                <ChatDisplay
                    isGroupChat = {currentChat.isGroupChat}
                />
            </div>
            <Loading/>
            <div className='w-full h-[10%] bg-primary-color flex items-center justify-center gap-4'>
                <div className='w-[5%] h-[70%] flex justify-center items-center bg-accent-color rounded-lg text-accent-complementary'>
                <input type="file" id="getImg" accept='image/*' className="hidden" onChange={(e)=>{setUploadedFile(e.target.files[0])}}/>
                <input type="file" id="getFile" accept="application/pdf" className="hidden" onChange={(e)=>{setUploadedFile(e.target.files[0])}}/>
                    <Dropdown
                    >
                        <MenuButton
                            slots={{ root: IconButton }}
                            sx={{color: '#ffffff', backgroundColor: "#1E40AF" ,"&:hover": {backgroundColor: "#1E40AF" }}}
                        >
                            <i className="fa-solid fa-paperclip"></i>

                        </MenuButton>
                        <Menu>
                            
                            <MenuItem
                                onClick={handleInputClick}
                            >
                                <span className='w-full flex items-center gap-4'>
                                    <i className="fa-solid fa-image"></i>Image
                                </span>
                            </MenuItem>                            
                            <MenuItem
                                onClick={handleFileInputClick}
                            >
                                <span className='w-full flex items-center gap-4'>
                                    <i className="fa-solid fa-file"></i>Document
                                </span>
                            </MenuItem>
                            <MenuItem
                                onClick={handlePollInput}
                            >
                                <span className='w-full flex items-center gap-4'>
                                    <i className="fa-solid fa-bars"></i>Poll
                                </span>
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </div>
                <div className='w-[80%] h-[70%] flex items-center'>
                    <Input
                        color="neutral"
                        placeholder="Search"
                        size="lg"
                        variant="soft"

                        className='w-full h-full'
                        onChange={(e)=>{setTypedMsg(e.target.value); handleTyping()}}
                        defaultValue={typedMsg}
                        id="msgSender"
                    />
                </div>
                <div className='w-[5%] h-[70%] flex justify-center items-center bg-accent-color rounded-lg text-accent-complementary'>
                    <IconButton  
                        onClick={()=>{sendMsg()}}
                        className='h-full w-full' sx={{color: '#ffffff', backgroundColor: "#1E40AF" ,"&:hover": {backgroundColor: "#1E40AF" }}}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </IconButton>
                </div>
            </div>
        </div>

        :
        
        null
    }
    </>
  )
}
