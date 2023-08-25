import axios from "axios"
import { config ,backendURL} from "../../utils/utils"
import { useContext, useEffect, useState } from "react"
import moment from "moment";
import GlobalContext from "../../context/GlobalContext";
import ChatImage from "../Image/ChatImage";
import UserImage from "../Image/UserImage";

export default function DirectMessageComponent(props) {
    const [dataBase, setDataBase] = useState()
    const [name,setName]=useState()
    const [time,setTime]=useState()

    const getChat = async () => {
        const data = await axios.get(`${backendURL}/api/chats/${props.chatId}`,config)
        setDataBase(data.data)

        const timestamp = data.data.updatedAt
        setTime(moment(timestamp).format("hh:mm"))

        if(data.data.isGroupChat === true){
            setName(data.data.chatName)
        }

        if(data.data.isGroupChat === false){
            var searchUser = ""
            data.data.members.map((data)=>
                (data !== props.currentUserId ? searchUser = data : null)
            )
            getUsers(searchUser)
        }
    }
    const [senderData, setSenderData] = useState()
    const getUsers = async (userId) => {
        const data = await axios.get(`${backendURL}/api/users/${userId}`,config)
        setName(data.data.name)
        setSenderData(data.data.userID)
    }

    useEffect(()=>{
        if(props.chatId){
            getChat()
        }
    },[props.chatId])

    const {setCurrentChat, unread , currentChat} = useContext(GlobalContext)
    
    const [localUnread, setLocalUnread]=useState()
    const handleUnread = ()=>{
        unread.map((data)=>{
            if(data.chatId === props.chatId){
                setLocalUnread(data.number)
            }
            else{
                setLocalUnread(0)
            }
        })
    }
    useEffect(()=>{
        if(unread && props.chatId){
            handleUnread()
        }
    },[unread])

    const getActiveCheck = ()=>{
        if(props.chatId === currentChat?._id){
            return "bg-slate-100"
        }
        else{
            return ""
        }
    }
  return (
    <>
    {

    name?
    <button className={`w-full h-20 flex justify-between rounded-lg items-center ${getActiveCheck()}`}
        onClick={()=>{setCurrentChat(dataBase)}}
    >
        <div className='w-[80%] flex gap-3 sm:justify-center sm:w-full'>
            <div className='w-14 h-14 rounded-full flex justify-center items-center sm:hidden'>
                {
                    dataBase?.isGroupChat?
                    <ChatImage chatId = {dataBase._id}/>
                    :
                    <>
                    {   
                        senderData?
                        <UserImage userId={senderData}/>
                        :null
                    }
                    </>
                    
                }
            </div>
            <div className='flex flex-col justify-center text-center'>
                <span className='font-medium text-lg'>{name}</span>
            </div>
        </div>
        <div className='w-[20%] flex justify-center items-center sm:hidden'>
            {
                localUnread > 0?
                <div className='w-6 h-6 rounded-full bg-accent-color text-accent-complementary text-center justify-center items-center md:hidden'>
                    <span>{localUnread}</span>
                </div>
                :null
            }
            <span>{time}</span>
        </div>
    </button>
    :null}
</>
  )
}