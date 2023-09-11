import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { config, backendURL } from '../utils/utils'; 

import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { useNavigate, useParams } from 'react-router';
import Users from '../components/PollUsers/Users';

export default function PollResult() {

    const [dataBase, setDataBase] = useState()
    const {id}= useParams()
    const navigate = useNavigate()
    const getPollData = async()=>{
      const renderedData = await axios.get(`${backendURL}/api/polls/${id}`,config)
      setDataBase(renderedData.data)
    }

    useEffect(()=>{
        if(id){
          getPollData()        
        }
  
    },[])

    console.log(dataBase);
  return (
    <>
    {
    dataBase?
    <div className='w-screen h-screen flex justify-center items-center bg-secondary-color'>
        <div className='w-[60%]  bg-primary-color rounded-lg flex flex-col items-center'>
            <div className='w-[90%] flex justify-between items-center'>
                <div>
                    <h1 className='text-4xl font-semibold mt-4'>{dataBase.title}</h1>
                    <h3 className='text-xl font-semibold mt-2'>{dataBase.description}</h3>
                    <h3 className='text-3xl  mt-2'>Total Votes {dataBase.membersVoted.length}</h3> 
                </div>
                <div className='flex flex-col justify-center '>
                    <h1 className='text-xl font-semibold mb-2'>Created By</h1>
                    <Users userId={dataBase.senderId}/>
                </div>
               
            </div>

            <div className='w-[90%] mt-4 flex flex-col gap-4 mb-8'>
                    {/* OPION LOGIC */}
                {
                    dataBase?.options?.map((data,i) =>
                    <div className={`w-full h-20 font-medium rounded flex justify-start gap-6 items-center text-xl border-2 border-gray-200`} key={i}>

                        <div className='w-[70%] flex gap-5'>
                            <span className='ml-2'>{i+1}.</span>

                            {
                                dataBase.type === "MultipleChoice"?
                                <span>{data.data}</span>
                                :
                                <div className='w-40 h-40'>
                                    <ImageDownload
                                        fileId={data.data}
                                    />  
                                </div>                  
                            }
                            
                        </div>
                        <div className='w-[30%] flex justify-evenly'>
                            <span>Vote : {data.vote}</span>
                        
                        <Dropdown>
                            <MenuButton>Users Voted</MenuButton>
                            <Menu>
                                {
                                    data.peopleVoted.length ===0?
                                        <MenuItem >
                                            No Votes
                                        </MenuItem>   
                                    :
                                    data.peopleVoted.map((data,j)=>
                                        <MenuItem key={j}>
                                            <Users userId={data}/>
                                        </MenuItem>                                    
                                    )
                                }

                            </Menu>
                        </Dropdown>
                        </div>
                    </div>
                    )
                }
            </div>
            <button className='w-20 h-10 bg-accent-color text-accent-complementary rounded mb-8' onClick={()=>{navigate("/")}}>
                BACK
            </button>
        </div>
    </div>
    :
    null
    }
    </>
  )
}
