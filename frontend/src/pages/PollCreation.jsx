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

export default function PollCreation() {

    const {isPollOpen, setIsPollOpen, user, currentChat ,socketSendMsg} = useContext(GlobalContext)
    const [pollType, setPollType] = useState("MultipleChoice")
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()

    const [option, setOption] = useState([
        {
            id: 6453666,
            data : ""
        }
    ])

    const handleOptionAdd = () => {
      const generatedId = createRandom(8)

      addOption({
        id: generatedId,
        data : ""
      })
    }

    const handleTextChange = (data, index) => {
      var localOptions = option

      for(var i=0; i< localOptions.length; i++) {
        if(localOptions[i].id === index){
          localOptions[i].data = data
          break
        }
      }
      setOption(localOptions)
    }

    const handleInputClick = (idx) => {
      document.getElementById(`getImg${idx}`).click()
    }

    const handleImageChange = (file, index)=> {
      var localOptions = option

      for(var i=0; i< localOptions.length; i++) {
        if(localOptions[i].id === index){
          localOptions[i].data = file
          break
        }
      }
      setOption(localOptions)
    }

    const addOption = (item) => setOption((tasks) => [...tasks, item]);
    const removeOption = (id) => setOption((tasks) => tasks.filter((item) => item.id !== id));

    const createPoll = async ()=>{
      var data = null
      if(pollType === "MultipleChoice"){
        data =  await createTextPoll()
      }
      if(pollType === "Image"){
        data = await createImagePoll()
      }

      if(data !== null){
        await currentChat.members.map((data)=> 
            (data !== user.userID ? makeUnreadMessageReq(data) : null)
        )
        console.log("MSGSENT", data);
        socketSendMsg(data , "poll");
        setIsPollOpen(false)
      }
    }
    const makeUnreadMessageReq = async(userId)=>{
      console.log(userId, currentChat._id);
        await axios.put(`${backendURL}/api/users/addUnread/${userId}/${currentChat._id}`,{
            chatId : currentChat._id,
            number : 1
        },config) 
    }
    const createTextPoll = async()=>{
      var checkVerified = true
      var localOptions = option

      for(var i=0; i< localOptions.length; i++) {
        localOptions[i] = {
          ...localOptions[i],
          vote : 0,
          peopleVoted : []
        }
        if(localOptions[i].data === ""){
          checkVerified = false;
        }
      }
      if(title === undefined){
        checkVerified = false;
      }

      if(checkVerified === true){
        const data = await axios.post(`${backendURL}/api/polls/createPoll/${currentChat._id}`, {
          title : title,
          description : (description === undefined ?"": description),
          type : pollType,
          senderId : user.userID,
          chatId : currentChat._id,
          options : localOptions,
          membersVoted : []
        } , config)

        return data.data
      }
    }

    const createImagePoll = async () =>{
      var checkVerified = true
      var localOptions = option

      for(var i=0; i< localOptions.length; i++) {
        if(localOptions[i].data === ""){
          checkVerified = false;
          break
        }
        const UploadImg = await handleImageUpload(localOptions[i].data)
        localOptions[i] = {
          id :localOptions[i].id,
          data : UploadImg,
          vote : 0,
          peopleVoted : []
        }
      }
      if(title === undefined){
        checkVerified = false;
      }

      if(checkVerified === true){
        const data = await axios.post(`${backendURL}/api/polls/createPoll/${currentChat._id}`, {
          title : title,
          description : (description === undefined ?"": description),
          type : pollType,
          senderId : user.userID,
          chatId : currentChat._id,
          options : localOptions,
          membersVoted : []
        } , config)
        return data.data
      }
    }

    const handleImageUpload = async (uploadedFile)=>{
      if(uploadedFile){
        const myFile = await axios.post(`${backendURL}/api/files/uploadFile/poll/${currentChat._id}`, {
            file : uploadedFile,
            title : "Poll Image",
            description : "Poll Image",
            senderId : user.userID
        }, 
        {
            headers : {'Content-Type': 'multipart/form-data'}
        })

        return myFile.data._id
    }
    }
    useEffect(()=>{
      setOption([
        {
            id: 6453666,
            data : ""
        }
      ])
    },[pollType])

    useEffect(()=>{
      console.log(option);
    },[option])
    return (
        <>              
          <Modal open={isPollOpen} >
    
            <ModalDialog
              aria-labelledby="basic-modal-dialog-title"
              aria-describedby="basic-modal-dialog-description"
              sx={{ width: 600, maxHeight : 700 }}
            >
              <Typography id="basic-modal-dialog-title" level="h2">
                Create Poll
              </Typography>
              <Typography id="basic-modal-dialog-description">
                Fill in the information of the poll.
              </Typography>  
   
                <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Title</FormLabel>
                        <Input autoFocus required 
                          placeholder= "Title"
                            onChange={(e)=>{setTitle(e.target.value)}}
                        /> 

                    </FormControl>
                    <FormControl>
                        <FormLabel>Description (optional)</FormLabel>
                        <Input autoFocus required 
                          placeholder= "Description"
                            onChange={(e)=>{setDescription(e.target.value)}}
                        /> 
                    </FormControl>
                    <FormControl>
                    <FormLabel>Voting Type</FormLabel>
                    <Select
                        defaultValue="MultipleChoice"
                        slotProps={{
                        button: {
                            id: 'select-field-demo-button',
                            // TODO: Material UI set aria-labelledby correctly & automatically
                            // but Base UI and Joy UI don't yet.
                            'aria-labelledby': 'select-field-demo-label select-field-demo-button',
                        },
                        }}
                        onChange={(e, value)=>{setPollType(value)}}
                    >
                        <Option value="MultipleChoice">Multiple choice</Option>
                        <Option value="Image">Image Poll</Option>
                    </Select>
                  </FormControl>
                  {
                    pollType === 'MultipleChoice' && 
                        <>
                            <FormLabel>Add Options</FormLabel>

                            {
                              option.map((data,i)=>
                                <FormControl key={i}>
                                <div className='w-full flex justify-center items-center mb-2' >
                                
                                  <Input autoFocus required 
                                  className='w-[95%]'
                                  placeholder= {`Option ${i+1}`}
                                    onChange={(e)=>{handleTextChange(e.target.value, data.id)}}
                                  />           
                                  <button className='w-[5%]'
                                    onClick={()=>{removeOption(data.id)}}
                                  >
                                    <i className="fa-solid fa-xmark"></i>
                                  </button> 
                                                   
                                </div>  
                                </FormControl>                             
                              )
                            }
                            <button className='w-32 h-10 rounded  bg-accent-color text-accent-complementary mt-4'
                                  onClick={handleOptionAdd}
                            >
                              Add Option
                            </button>

                        </>
                    
                  }
                  {
                    pollType === "Image" &&
                    <>
                    <div className='w-full flex flex-wrap justify-evenly'>
                      {
                        option.map((data,i)=>
                          <div className='flex flex-col gap-2' key={i}>
                            <input type="file" className='hidden' id={`getImg${i}`} onChange={(e)=>{handleImageChange(e.target.files[0], data.id)}}/>

                            {
                              data?.data === ""?
        
                              <Button type="submit"
                                variant='soft'
                                color="neutral"
                                  onClick={()=>handleInputClick(i)}
                                  className='w-40 h-32 flex gap-4'
                                >
                              <i className="fa-solid fa-arrow-up-from-bracket"></i>UPLOAD   
                              </Button>                             
                              
                              :
                              <div 
                                  className='w-40 h-32 flex gap-4 bg-green-200 rounded-lg justify-center items-center'
                              >
                              <i className="fa-solid fa-check"></i>UPLOADED   
                              </div>

                            }
                            
                          <Button type="submit"
                            variant='soft'
                            color="danger"
                              onClick={()=>{removeOption(data.id)}}
                              className='w-40 h-10 rounded flex gap-4'
                            ><i className="fa-solid fa-trash"></i>Remove</Button>
                          </div>                        
                        
                        )
                      }
                    </div>
                    <button className='w-32 h-10 rounded  bg-accent-color text-accent-complementary mt-4'
                            onClick={handleOptionAdd}
                      >
                        Add Option
                    </button>
                    </>
                  }
                  <Button type="submit"
                    onClick={createPoll}
                  >Create</Button>
                  <Button type="submit"
                  variant="soft" color="danger"
                    onClick={()=>setIsPollOpen(false)}
                  >Cancel</Button>
                </Stack>
            </ModalDialog>
          </Modal>
        </>
      )
}
