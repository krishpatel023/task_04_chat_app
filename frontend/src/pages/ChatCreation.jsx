import {useState, useEffect, useContext} from 'react';
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
import GlobalContext from '../context/GlobalContext';
import axios from 'axios'
import {backendURL, config, createRandom} from '../utils/utils'
export default function ChatCreation() {
    const {createChatBox, setCreateChatBox,user} = useContext(GlobalContext)

    //INPUTS
    const [chatType,setChatType]=  useState("Normal")
    const [chatName, setChatName] =  useState()
    const [selectedMembers, setSelectedMembers] =  useState([])
    const [selectedNames, setSelectedNames] =  useState([])

    const handleAddMembers = (id, name) => {
        var doesExist = false
        selectedMembers.map((data)=>
            (data === id ? doesExist = true : null)
        )

        if(doesExist === false){
            addMembers(id)
            addMembersName(name)
        }
    }
    const addMembers = (item) => setSelectedMembers((tasks) => [ ...tasks, item]);
    const deleteMembers = (id) => setSelectedMembers((tasks) => tasks.filter((item) => item !== id));
    const addMembersName = (item) => setSelectedNames((tasks) => [ ...tasks, item]);
    const deleteMembersName = (id) => setSelectedNames((tasks) => tasks.filter((item, i) => i !== id));
    //====================
    const [dataBase, setDataBase]= useState()
    const getUserData = async () => {
        const data = await axios.get(`${backendURL}/api/users/`, config)
        setDataBase(data.data)
    }
    const createChat = async()=>{
       
        var chatId = ""
        if(chatType === "Normal" && selectedMembers.length > 1){
            console.log("RUN");
            await axios.post(`${backendURL}/api/chats/createChat`,{
                isGroupChat : false,
                members : selectedMembers
            },config)
        }
        if(chatType === "Group" && selectedMembers.length > 1 && uploadedFile){
            const data = await axios.post(`${backendURL}/api/chats/createChat`,{
                isGroupChat : true,
                chatName : chatName,
                members : selectedMembers,
                admin: [selectedMembers[0]]
            },config)
            chatId = data.data
            handleFileUpload(chatId)
      }
      setCreateChatBox(false) 
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
      }
  }
  const handleInputClick = ()=>{
      document.getElementById('getFile').click()
  }  
  return (
    <>

      <Modal open={createChatBox} >

        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" level="h2">
            Create Chat
          </Typography>
          <Typography id="basic-modal-dialog-description">
            Fill in the information of the project.
          </Typography>      


            <input type="file" className='hidden' id="getFile" onChange={(e)=>{setUploadedFile(e.target.files[0])}}/>
            <Stack spacing={2}>
                <FormControl>
                <FormLabel>Select Type</FormLabel>
                <Select
                    defaultValue="Normal"
                    slotProps={{
                    button: {
                        id: 'select-field-demo-button',
                        // TODO: Material UI set aria-labelledby correctly & automatically
                        // but Base UI and Joy UI don't yet.
                        'aria-labelledby': 'select-field-demo-label select-field-demo-button',
                    },
                    }}
                    onChange={(e, value)=>{setChatType(value)}}
                >
                    <Option value="Normal">Normal</Option>
                    <Option value="Group">Group</Option>
                </Select>
              </FormControl>
              {
                chatType === 'Group' && 
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input autoFocus required 
                        onChange={(e)=>{setChatName(e.target.value)}}
                        />
                    </FormControl>
                
              }
              <FormControl>
                <FormLabel>Select Member</FormLabel>
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
                                onClick={(e, value)=>{handleAddMembers(data.userID, data.name)}}
                            >{data.name}</Option>
                        )
                        :null
                    }
                </Select>
              </FormControl>
              <FormControl>
              <div className='w-full'>
                    {
                        selectedMembers?
                        selectedMembers.map((data,i)=>
                            <div className='flex justify-center rounded items-center h-8 bg-accent-color text-accent-complementary' key={i}>
                                <div className='w-[90%] flex justify-between items-center'>
                                    {selectedNames[i]}
                                    <button
                                        onClick={()=>{deleteMembers(data);deleteMembersName(i)}}
                                    ><i className="fa-solid fa-xmark"></i></button>
                                </div>

                            </div>
                        )
                        :null
                    }
              </div>
              </FormControl>
              {
                chatType === "Group" &&
                <FormControl>
                <FormLabel>Chat Profile Image</FormLabel>
                  <Button type="submit"
                  variant='soft'
                  color="neutral"
                    onClick={handleInputClick}
                    className='flex gap-4'
                  ><i className="fa-solid fa-arrow-up-from-bracket"></i>UPLOAD</Button>
                </FormControl>
              }
              {
                uploadedFile?
                <h1>FILE UPLOADED!</h1>
                :null
              }
              <Button type="submit"
                onClick={createChat}
              >Create</Button>
              <Button type="submit"
              variant="soft" color="danger"
                onClick={()=>setCreateChatBox(false)}
              >Cancel</Button>
            </Stack>
        </ModalDialog>
      </Modal>
    </>
  )
}
