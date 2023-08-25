import React , {useState, useEffect} from 'react'
import GlobalContext from './GlobalContext'
import axios from 'axios';
import { config, backendURL } from '../utils/utils';
// SOCKET IO
import io from 'socket.io-client'

var socket;

export default function ContextWrapper(props) {
  console.log("==============================================")
    const [messages, setMessages] = useState([])
    const [user, setUser] = useState()
    const [currentChat, setCurrentChat] = useState()
    const [unread, setUnread] = useState([])
  const [open, setOpen] = useState(false)
  const [createChatBox,setCreateChatBox]=useState(false)
  const [chatSettings,setChatSettings]=useState(false)
  const [loading,setLoading]=useState(false)

    const addMessage = (item) => setMessages((tasks) => [...tasks, item]);
    // const deleteEvents = (id) => setEventList((tasks) => tasks.filter((item) => item.id !== id));

    const eraseUnreadMsg = async(userId, chatId)=>{
      await axios.put(`${backendURL}/api/users/removeUnread/${userId}/${chatId}`,{},config) 
    }

  const [typing,setTyping] = useState(false)
  //SOCKET IO
  const [socketConnected, setSocketConnected] = useState(false)
  const socketIoSend = ()=>{
    socket = io(backendURL)
    socket.emit('setup', user.userID)
    socket.on('connected', () => setSocketConnected(true))  


  }
  useEffect(()=>{
    if(user){
      socketIoSend()
      setUnread(user.unread)
    }
  },[user])

  const socketJoinRoom = () => {
    socket = io(backendURL)
    socket.emit('join chat', currentChat._id)
  }
  useEffect(()=>{
    if(currentChat){
      setMessages(currentChat.chatData)
      setDeleteMsgArray(currentChat.chatData)
      eraseUnreadMsg(user.userID, currentChat._id)
      removeUnread(currentChat._id)
      socketJoinRoom()
    }
  },[currentChat])

  const socketNewMessage = ()=>{
    if(user){
    socket.on('message received', (message)=>{
        if(message.msgRecieved.chatId === message.chatDetail._id){
          addMessage({
            ID : message.msgRecieved._id,
            type : (message.msgRecieved.data ? "message" : "file")
          })
        }
        if(message.msgRecieved.chatId !== message.chatDetail._id){
          //give notification
          addUnread(message.chatDetail._id)
        }
        eraseUnreadMsg(user.userID, message.msgRecieved.chatId)
    })
    }
  }
  useEffect(()=>{
    socketNewMessage()
    if(user && socketConnected){
      socket.on('typing', ()=>setTyping(true))
      socket.on('stop typing',()=>setTyping(false))  
    }
  })
  const socketSendMsg = (msg, type)=>{
    addMessage({
      ID : msg._id,
      type : type 
    })
    socket.emit('new message', msg, currentChat)
  }

  const handleTyping = ()=>{
    if(!socketConnected) return;


    socket.emit('typing', currentChat._id)
    
    let lastTypingTime = new Date().getTime()
    var timer_length = 3000

    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      console.log(timeDiff);
      if(timeDiff > timer_length){
        socket.emit('stop typing', currentChat._id)
        // setTyping(false)
      }
    },timer_length)
  }

    // USER UNREAD CHANGE
    const addUnread = (chatId)=>{
      var chatData = ""

      for(var i=0; i<unread.length; i++){
          if(unread[i].chatId === chatId){
              chatData = unread[i];
              break;
          }
      }

      if(chatData === ""){
          //add
          setUnread([...unread , {
            chatId : chatId,
            number : 1
          }])
      }
      if(chatData !== ""){
          //addOne
          const myData = unread.map(data => {
              if(data.chatId === chatId){
                  data.number = data.number + 1
              }
              return data;
          }
          )
          setUnread(myData)
      }
    }
  const removeUnread = (chatId)=>{
    var chatData = ""

    for(var i=0; i<unread.length; i++){
        if(unread[i].chatId === chatId){
            chatData = user.unread[i];
            break;
        }
    }

    if(chatData === ""){
        //NOTHING
    }
    if(chatData !== ""){
        const myData = unread.filter(function(item) {
            return item.chatId !== chatId
        })
        setUnread(myData)
        console.log("UNREAD", myData);
    }
  }

    const [deleteMsg, setDeleteMsg]=useState(false)
    const [deleteMsgArr, setDeleteMsgArray]= useState([])
    const addDeleteMsg = (item) => setDeleteMsgArray((tasks) => [...tasks, item]);
    const removeDeleteMsg = (id) => setDeleteMsgArray((tasks) => tasks.filter((item) => item.ID !== id));
    useEffect(()=>{
      if(deleteMsg === false){
        setDeleteMsgArray(messages)        
      }
    },[deleteMsg])
    const handleMsgDelete = async()=>{
      console.log("RUN SUCCESSSFUL OUTER");

      if(currentChat){    
        console.log("RUN SUCCESSSFUL");
        await axios.put(`${backendURL}/api/chats/deleteMsg/${currentChat._id}`,{
          chatData: deleteMsgArr
        }, config)
        const getChat = await axios.get(`${backendURL}/api/chats/${currentChat._id}`,{
          chatData: deleteMsgArr
        }, config)
        setDeleteMsg(false)
        setCurrentChat(getChat.data)
      }
    }
    console.log("DELETE MSG ARR",deleteMsgArr);

    const value = {
        messages,
        addMessage,

        open,
        setOpen,
        createChatBox,
        setCreateChatBox,

        user,
        setUser,
        currentChat,
        setCurrentChat,
        socketSendMsg,
        typing,
        handleTyping,
        unread,
        chatSettings,
        setChatSettings,
        loading,
        setLoading,

        deleteMsg,
        setDeleteMsg,
        deleteMsgArr,
        removeDeleteMsg,
        handleMsgDelete
    }
  return (
      <GlobalContext.Provider value={value}>
        {props.children}
      </GlobalContext.Provider>
  )
}