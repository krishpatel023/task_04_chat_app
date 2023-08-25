import {useState , useEffect, useContext} from 'react'
import IMG from '../../../assets/grp_chat.jpg'
import axios from 'axios'
import { config, backendURL } from '../../../utils/utils'
import GlobalContext from '../../../context/GlobalContext'
import UserImage from '../../Image/UserImage'
export default function GroupMessageComponent(props) {
  const [dataBase,setDataBase]=useState()
  const [role,setRole]=useState("sender")

  const getMsg = async()=>{
    const data = await axios.get(`${backendURL}/api/messages/${props.messageId}`, config)
    setDataBase(data.data)
    decideRole(data.data.senderId)
    setSenderData(data.data.senderId)
  }
  const [senderData, setSenderData]= useState()

  const decideRole = async(myId)=>{
    if(myId === props.userId){
      setRole("sender")
    }
    else{
      setRole("receiver")
    }
  }
  useEffect(()=>{
    if(props.messageId){
      getMsg()
    }
  },[])

  return (
    <>
    {
      dataBase && role?


    <div className='w-full flex justify-center my-2'>
      {
        role === "sender" ?
        <div className='w-[95%] flex justify-end'>
          <div className='max-w-[30rem]  min-h-12 rounded-3xl bg-accent-color text-accent-complementary flex items-center px-4 py-2'>
            <span>{dataBase.data}</span>
          </div>
        </div>  
        :
        <div className='w-[95%] flex justify-start gap-4'>
          
          <div className='h-12 w-12 rounded-full'>
            {
              senderData?
              <div className='w-12 h-12 rounded-full'>
                <UserImage userId={senderData}/>                
              </div>

              :null
            }
          </div>
          
          <div className='max-w-[30rem]  min-h-12 rounded-3xl bg-primary-color text-primary-complementary flex items-center px-4 py-2'>
            <span>{dataBase.data}</span>
          </div>
        </div>
      }
    </div>
    :
      null
    }
    </>
  )
}
