import UserProfiles from './UserProfiles'
import IMG from '../../assets/grp_chat.jpg'
import GlobalContext from '../../context/GlobalContext'
import Button from '@mui/joy/Button';
import {useState, useEffect, useContext} from 'react';
import axios from 'axios'
import { config, backendURL } from '../../utils/utils';
import ChatEdit from './ChatEdit';
import ChatImage from '../Image/ChatImage';
export default function ChatDetails() {
  const {setChatSettings} = useContext(GlobalContext)

  const [editChat, setEditChat]= useState(false)

  const {currentChat, user} = useContext(GlobalContext)
  const [isAdmin , setIsAdmin] = useState()
  function decideAccess(){
    for(var i=0; i<currentChat.admin.length; i++){
      if(currentChat.admin[i] === user.userID){
        setIsAdmin(true)
        break
      }
    }
  }
  useEffect(()=>{
    decideAccess()
  },[])
  return (
    <>
    {
      editChat === false?
    
    <div className='w-full h-full flex flex-col items-center'>
      <div className='w-[95%] h-[10%] flex justify-between items-center'>
        <h1 className='font-semibold text-xl'>Chat Details</h1>
        <button className='w-10 h-full' onClick={()=>setChatSettings(false)}><i className="fa-solid fa-xmark fa-xl"></i></button>
      </div>
      <div className='w-full h-[25%] flex flex-col justify-center items-center gap-2'>
        <div className='w-40 h-40 rounded-full'>
          <ChatImage chatId={currentChat?._id}/>
          {/* <button className='min-w-full min-h-full rounded-full relative top-[-100%] text-3xl hover:bg-hover-color'>
          <i className="fa-solid fa-camera"></i>
          </button> */}
        </div>
        <h1 className='font-semibold text-2xl'>{currentChat?.chatName}</h1>
      </div>
      <div className='w-[40%] h-[55%] flex flex-col gap-4 mt-4 overflow-y-auto'>
        <h1 className='font-semibold text-xl'>Members</h1>
        {
          currentChat?
          currentChat.members.map((data,i)=>
            <UserProfiles
              userId = {data}
              admin={currentChat.admin}
              key={i}
            />
          )
          :
          null
        }
      </div>
      {
        isAdmin?
      
      <button className='w-40 h-10 rounded bg-accent-color text-accent-complementary'
        onClick={()=>setEditChat(true)}
      >
        EDIT
      </button>
      :
      <Button
          disabled
      >EDIT</Button>
      }
    </div>
    :
    <ChatEdit/>
    
    }
  </>
  )
}
