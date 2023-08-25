import React, { useContext, useEffect, useState } from 'react'
import MessageComponent from './MessageComponent'
import GroupMessageComponent from './GroupMessageComponent'
import GlobalContext from '../../../context/GlobalContext'
export default function MessageIdentification({data,user, isGroupChat, isAdmin}) {
  const [isSelected, setIsSelected] = useState(false) 
  const {removeDeleteMsg, setDeleteMsg, deleteMsg} = useContext(GlobalContext)
  const decideState = ()=>{

    if(isSelected){
      return "bg-slate-300"
    }
    else{
      return ""
    }
  }
  useEffect(()=>{
    if(deleteMsg === false){
      setIsSelected(false)
    }
    decideState()
  },[isSelected, deleteMsg])

  const handleSelect = ()=>{
    if(isAdmin === true){
      setIsSelected(true)
      removeDeleteMsg(data.ID)
      setDeleteMsg(true)
    }
  }
  return (
        <>
            {

            isGroupChat === false?
            <button className={`w-full ${decideState()}`}
              onClick={handleSelect}
            >
            <MessageComponent
                messageId={data.ID}
                userId = {user.userID}
            />    
            </button>  
            :  
            <button className={`w-full ${decideState()}`}
              onClick={handleSelect}
            > 
            <GroupMessageComponent
              messageId={data.ID}
              userId = {user.userID}
            />
            </button> 
            }
        </>
  )
}
