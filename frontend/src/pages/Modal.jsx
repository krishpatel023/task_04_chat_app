import {useState, useContext, useEffect} from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
// import Add from '@mui/icons-material/Add';
import Typography from '@mui/joy/Typography';
import GlobalContext from '../context/GlobalContext';
import axios from 'axios'
import {backendURL, config, createRandom} from '../utils/utils'
export default function BasicModalDialog() {

  const { open, setOpen, setUser} =   useContext(GlobalContext)

  const [name, setName] =   useState()
  const [email, setEmail] =   useState()

  const addUser = ()=>{
    setUser({
      name : name,
      email : email
    })
    addUserToBackend()
  }
  const addUserToBackend = async ()=>{
    const myImg = createRandom(12)
    const myUserId = createRandom(12)
    await axios.post(`${backendURL}/api/users/createUser`, {
      userID : myUserId,
      name: name,
      email : email,
      img : myImg,
      chat : []
    },config)
    handleFileUpload(myUserId)
    setOpen(false)
  }
  const login = async ()=>{
    const data = await axios.get(`${backendURL}/api/users/byEmail/${email}`,config)
    setUser(data.data)
    setOpen(false)
  }
  const [uploadedFile, setUploadedFile] = useState()
  // 
  const handleFileUpload = async (userId)=>{
    if(uploadedFile){
        const myFile = await axios.post(`${backendURL}/api/files/uploadFile/user/${userId}`, {
            file : uploadedFile,
            title : "User Profile",
            description : "User Profile",
            senderId : userId
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
      <Modal open={open}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="basic-modal-dialog-title" level="h2">
            Create User
          </Typography>
          <Typography id="basic-modal-dialog-description">
            Fill in the information of the project.
          </Typography>
            <input type="file" className='hidden' id="getFile" onChange={(e)=>{setUploadedFile(e.target.files[0])}}/>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input autoFocus required 
                  onChange={(e)=>{setName(e.target.value)}}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input required 
                  onChange={(e)=>{setEmail(e.target.value)}}
                />
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
              <Button type="submit"
                onClick={addUser}
              >Create</Button>
              <Button type="submit"
                onClick={login}
              >Login</Button>
              <Button type="submit"
              variant="soft" color="danger"
                onClick={()=>setOpen(false)}
              >Cancel</Button>
            </Stack>
        </ModalDialog>
      </Modal>
    </>
  );
}
