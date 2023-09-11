import React from 'react'
import GlobalContext from '../../context/GlobalContext';
import { useContext, useEffect, useState } from 'react';
import Typing from './Typing';
import FileComponent from './File/FileComponent';
import MessageIdentification from './Message/MessageIdentification';
import FileIdentification from './File/FileIdentification';
import Loading from '../Loading/Loading';
import PollIdentification from './Poll/PollIdentification';
export default function ChatDisplay(props) {
    
    const { user, messages, currentChat } = useContext(GlobalContext)

    const [isAdmin, setIsAdmin ] = useState(false)

    const handleRights = ()=>{
      for(var i=0; i<currentChat.admin.length; i++){
        if(currentChat.admin[i] === user.userID){
          setIsAdmin(true);
          break;
        }
        else{
          setIsAdmin(false);
        }
      }
    }
    useEffect(()=>{
        console.log("=");
        handleRights()
    },[messages])
  return (
    <div className='min-h-full w-full flex flex-col justify-end'>
      {
          messages && props?
          messages.map((data,i)=>
          
            <React.Fragment key={i}>
              {
                data.type === "message" && 
                  <MessageIdentification
                    data={data}
                    user={user}
                    isGroupChat={props.isGroupChat}
                    isAdmin={isAdmin}
                  />                  
                
              }
              {
                data.type ==="file" && 
                  <FileIdentification
                    data={data}
                    user={user}
                    isGroupChat={props.isGroupChat}
                    isAdmin={isAdmin}
                  />                  
                
              }
              {
                data.type === "poll" && 
                  <PollIdentification
                    data = {data}
                    user = {user}
                    isAdmin={isAdmin}
                  />
              }
            </React.Fragment>
          )
          :null
      }
      <Typing/>
    </div>
  )
}
