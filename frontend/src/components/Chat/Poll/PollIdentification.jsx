import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { config, backendURL } from '../../../utils/utils'
import GlobalContext from '../../../context/GlobalContext'
import TextPoll from './TextPoll'
import ImagePoll from './ImagePoll'

export default function PollIdentification({isAdmin, data}) {
    const [dataBase, setDataBase] = useState()
    const [role, setRole] = useState()
    const [senderData, setSenderData]= useState()
    const {user} = useContext(GlobalContext)


    const getPollData = async()=>{
      const renderedData = await axios.get(`${backendURL}/api/polls/${data.ID}`,config)
      setDataBase(renderedData.data)
      decideRole(renderedData.data.senderId)
      setSenderData(renderedData.data.senderId)
      canVote(renderedData.data)
      console.log(renderedData.data)
    }
    const [isVotable, setIsVotable]=useState()
    const canVote = (dataBase)=>{
      if(dataBase){
      var counter = true
      
      for(var i=0; i<dataBase.membersVoted.length; i++){
        if(dataBase.membersVoted[i] === user.userID){
          counter = false
          break
        }
      }
      console.log(counter);
      setIsVotable(counter)
      }
    }
    const decideRole = async(myId)=>{
      if(myId === user.userID){
        setRole("sender")
      }
      else{
        setRole("receiver")
      }
    }
    const handleAfterSubmission = ()=>{
      console.log("RUN 3636");
      setIsVotable(false)
    }

    useEffect(()=>{
      if(data){
        console.log(data);
        getPollData()        
      }

    },[])


    // DELETE POLL
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
      dataBase && role?
      <>
      {
        dataBase.type === "MultipleChoice"?
        <button className={`w-full ${decideState()}`}
          onClick={handleSelect}
        >
        <TextPoll
          dataBase={dataBase}
          role={role}
          senderData={senderData}
          isAdmin={isAdmin}
          isVotable={isVotable}
          user ={ user}
          handleAfterSubmission={handleAfterSubmission}
        />
        </button>
        :
        <button className={`w-full ${decideState()}`}
          onClick={handleSelect}
        >
        <ImagePoll 
          dataBase={dataBase}
          role={role}
          senderData={senderData}
          isAdmin={isAdmin}
          isVotable={isVotable}
          user = {user}
          handleAfterSubmission = {handleAfterSubmission}

        />
        </button>
      }

      </>
    :
      null
    }
    </>
  )
}
