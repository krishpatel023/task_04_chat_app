import React from 'react'
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
// import Add from '@mui/icons-material/Add';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import UserProfileEdit from './UserProfileEdit';
import {useState, useEffect, useContext} from 'react';
import axios from 'axios'
import { config, backendURL } from '../../utils/utils';
import GlobalContext from '../../context/GlobalContext';
export default function ChatEdit() {
    const [chatName, setChatName] =  useState()
    const [selectedMembers, setSelectedMembers] =  useState([])
    const [selectedAdmin, setSelectedAdmin] =  useState([])

    const {currentChat, user,setChatSettings, setUser, setCurrentChat} = useContext(GlobalContext)
  
    useEffect(()=>{
      if(currentChat){
        setSelectedMembers(currentChat.members)
        setSelectedAdmin(currentChat.admin)
        setChatName(currentChat.chatName)
      }
    },[])
    const handleAddMembers = (id) => {
        var doesExist = false
        selectedMembers.map((data)=>
            (data === id ? doesExist = true : null)
        )
  
        if(doesExist === false){
            addMembers(id)
        }
    }
    const handleAddAdmin = (id) => {
      var doesExist = false
      selectedAdmin.map((data)=>
          (data === id ? doesExist = true : null)
      )

      if(doesExist === false){
          addAdmin(id)
      }
  }
    const addMembers = (item) => setSelectedMembers((tasks) => [ ...tasks, item]);
    const deleteMembers = (id) => setSelectedMembers((tasks) => tasks.filter((item) => item !== id));
    const addAdmin = (item) => setSelectedAdmin((tasks) => [ ...tasks, item]);
    const deleteAdmin = (id) => setSelectedAdmin((tasks) => tasks.filter((item) => item !== id));

    //====================
    const [dataBase, setDataBase]= useState()
    const getUserData = async () => {
        const data = await axios.get(`${backendURL}/api/users/`, config)
        setDataBase(data.data)
  
    }
    const handleEdit = async()=>{
        var fileData = ""
        if(selectedMembers.length > 0 && selectedAdmin.length > 0){
            await axios.put(`${backendURL}/api/chats/${currentChat._id}`,{
                isGroupChat : true,
                chatName : chatName,
                members : selectedMembers,
                admin: selectedAdmin,
            },config)
            if(uploadedFile){
              fileData = handleFileUpload(currentChat._id)
            }
            const chat = await axios.get(`${backendURL}/api/chats/${currentChat._id}`,config)
            setCurrentChat(chat.data)          
            if(uploadedFile){
              setCurrentChat( { ...chat.data ,  img : fileData } )
            }
            const data = await axios.get(`${backendURL}/api/users/${user.userID}`,config)
            setUser( data.data )

        }
        setChatSettings(false) 
    }
    const handleDelete = async()=>{
      await axios.delete(`${backendURL}/api/chats/${currentChat._id}`, config)
      const data = await axios.get(`${backendURL}/api/users/${user.userID}`,config)
      setUser( data.data )
      setCurrentChat()
      setChatSettings(false) 

    }
     useEffect(()=>{
        getUserData()
    },[])
    const [uploadedFile, setUploadedFile] = useState()
    // 
    const handleFileUpload = async (chatId)=>{
      if(uploadedFile){
          const myFile = await axios.post(`${backendURL}/api/files/uploadFile/chat/${chatId}`, {
              file : uploadedFile,
              title : "Chat Profile",
              description : "Chat Profile",
              senderId : user.userID
          }, 
          {
              headers : {'Content-Type': 'multipart/form-data'}
          })
          return myFile
      }
  }
  const handleInputClick = ()=>{
      document.getElementById('getFile').click()
  }  
  return (
<div className='w-full h-full flex flex-col items-center'>
          <div className='w-[95%] h-[10%] flex justify-between items-center'>
            <h1 className='font-semibold text-xl'>Chat Details</h1>
            <button className='w-10 h-full' onClick={()=>setChatSettings(false)}><i className="fa-solid fa-xmark fa-xl"></i></button>
          </div>
          <div className="w-[40%] h-[90%]">
            <input type="file" className='hidden' id="getFile" onChange={(e)=>{setUploadedFile(e.target.files[0])}}/>
            <Stack spacing={2}>
              <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input autoFocus required 
                    onChange={(e)=>{setChatName(e.target.value)}}
                    defaultValue={`${currentChat?.chatName}`}
                  />
              </FormControl>    
              <FormControl>
                <FormLabel>Add Member</FormLabel>
                <Select
                    slotProps={{
                    button: {
                        id: 'select-field-demo-button',
                        // TODO: Material UI set aria-labelledby correctly & automatically
                        // but Base UI and Joy UI don't yet.
                        'aria-labelledby': 'select-field-demo-label select-field-demo-button',
                    },
                    }}
                    // onChange={(e, value)=>{addMembers(value)}}
                >
                    {
                        dataBase?
                        dataBase.map((data,i)=>
                            <Option value={`${data.userID}`} key={i}
                                onClick={(e, value)=>{handleAddMembers(data.userID)}}
                            >{data.name}</Option>
                        )
                        :null
                    }
                </Select>
              </FormControl>        
              <FormControl>
              <div className='w-full max-h-60 overflow-y-scroll'>
                    {
                        selectedMembers?
                        selectedMembers.map((data,i)=>
                          <UserProfileEdit
                            key={i}
                            userId={data}
                            admin={selectedAdmin}
                            deleteMembers={deleteMembers}
                            addAdmin={handleAddAdmin}
                            deleteAdmin={deleteAdmin}
                          />
                        )
                        :null
                    }
              </div>
              </FormControl>

              <FormControl>
              <FormLabel>Chat Profile Image</FormLabel>
                <Button type="submit"
                variant='soft'
                color="neutral"
                  onClick={handleInputClick}
                  className='flex gap-4'
                ><i className="fa-solid fa-arrow-up-from-bracket"></i>UPLOAD</Button>
              </FormControl>
              
              {
                uploadedFile?
                <h1>FILE UPLOADED!</h1>
                :null
              }
              <Button 
              color="success"
                variant="soft"
                onClick={handleEdit}
              >Edit Chat</Button>
              <Button type="submit"
              variant="soft" color="danger"
                onClick={handleDelete}
              >Delete Chat</Button>
            </Stack>
          </div>
    </div>
  )
}
