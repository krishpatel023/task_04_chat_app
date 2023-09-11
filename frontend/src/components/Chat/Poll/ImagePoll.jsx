import {useState} from 'react'
import ImageDownload from './ImageDownload'
import UserImage from '../../Image/UserImage'
import axios from 'axios'
import { config, backendURL } from '../../../utils/utils'
import { useNavigate } from 'react-router'
export default function ImagePoll({dataBase, role, senderData, isAdmin, isVotable, user, handleAfterSubmission}) {
    const [selectedOption, setSelectedOption] = useState()


    const handleOptionClick = (temp)=>{
      if(isVotable){
        setSelectedOption(temp)
      }
    }
    const setColor = (id) => {
      if(isVotable){
        if(id === selectedOption){
          return "bg-gray-300 text-primary-complementary"
        }
        else{
          return "border-2 border-gray-300"
        }
      }
      else{
        const renderedId = checkWhichVote()
        if(id === renderedId){
          return "bg-green-300 text-primary-complementary"
        }
        else{
          return "border-2 border-gray-300"
        }
      }
    }
    const checkWhichVote = ()=>{
      if(dataBase){
        for(var i=0; i<dataBase.options.length; i++){
          for(var j=0; j<dataBase.options[i].peopleVoted.length; j++){
            if( dataBase.options[i].peopleVoted[j] === user.userID){
              return dataBase.options[i].id
            }
          }
        }
      }
    }
    
    const handleSubmitPoll = async () => {
      if(selectedOption !== undefined){
        await axios.put(`${backendURL}/api/polls/`, {
          optionId : selectedOption,
          pollId : dataBase._id,
          voterId : user.userID
        },config)
        handleAfterSubmission()
      }
    }

    const navigate = useNavigate()
    const handleViewResult = ()=>{
      navigate(`/poll/${dataBase._id}`)
    }
  return (
    <>
    {
        dataBase && role?
    
    <div className='w-full flex justify-center my-2'>
      {
        role === "sender" ?
        <div className='w-[95%] flex justify-end'>
          <div className='w-[30rem] min-h-12 rounded-3xl bg-accent-color text-accent-complementary flex flex-col px-4 py-2 gap-4 z-10'>
            {/* POLL LOGIC */}
            <h1 className='font-semibold text-4xl'>{dataBase?.title}</h1>
            <span className='font-semibold text-2xl'>{dataBase?.description}</span>
            {
              dataBase?.options?.map((data,i) =>
                <button className={`w-full font-medium rounded flex justify-start gap-6 items-center text-xl border-4 border-primary-color`}>
                  <span className='ml-2'>{i+1}.</span>
                  <div className='w-40 h-40'>
                    <ImageDownload
                        fileId={data.data}
                    />
                  </div>
                </button>
              )
            }
            <button className='h-12 w-full rounded underline text-lg font-semibold mb-4' onClick={handleViewResult}>
              View Result
            </button>       
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
          
          <div className='bg-primary-color text-primary-complementary w-[30rem] min-h-12 rounded-3xl flex flex-col px-4 py-2 gap-4'>
            {/* POLL LOGIC */}
            <h1 className='font-semibold text-4xl'>{dataBase?.title}</h1>
            <span className='font-semibold text-2xl'>{dataBase?.description}</span>
            {
              dataBase?.options?.map((data,i) =>
                <button className={`w-full   font-medium rounded flex justify-start gap-6 items-center text-xl ${setColor(data.id)}`} onClick={()=>handleOptionClick(data.id)} key={i}>
                  <span className='ml-2'>{i+1}.</span>
                  <div className='w-40 h-40'>
                    <ImageDownload
                        fileId={data.data}
                    />
                  </div>
                </button>
              )
            }

            {
              isVotable === true?
              <button className='h-12 w-full rounded-lg bg-accent-color text-accent-complementary text-lg font-semibold' onClick={handleSubmitPoll}>
                Submit
              </button>      
              :null
            }
            {
                isAdmin?
                <button className='h-12 w-full rounded underline text-lg font-semibold mb-4' onClick={handleViewResult}>
                View Result
                </button>
                :null                 
            }
          </div>
        </div>
      }
    </div>
    :null
    }
    </>
  )
}
