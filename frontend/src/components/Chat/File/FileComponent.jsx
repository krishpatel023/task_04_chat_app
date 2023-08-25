import {useState , useEffect, useContext} from 'react'
import axios from 'axios'
import { config, backendURL } from '../../../utils/utils'
import GlobalContext from '../../../context/GlobalContext'

export default function FileComponent(props) {
  const [dataBase,setDataBase]=useState()
  const [role,setRole]=useState("sender")
  const [file,setFile]=useState()
  const getMsg = async()=>{
    const data = await axios.get(`${backendURL}/api/files/${props.fileId}`, config)
    setDataBase(data.data)
    decideRole(data.data.senderId)
    if(data.data.type === "image"){
      imgDownload()
    }

  }

  const decideRole = async(myId)=>{
    if(myId === props.userId){
      setRole("sender")
    }
    else{
      setRole("receiver")
    }
  }
  useEffect(()=>{
    if(props.fileId){
      getMsg()
      
    }
  },[])

  const imgDownload = async()=>{
    if(props.fileId){
      const res = await axios.get(`${backendURL}/api/files/download/${props.fileId}`, { responseType: "blob" })

      const blob = new Blob([res.data], { type: res.data.type });
      setFile(window.URL.createObjectURL(blob))
    }
  }
  const downloadFile = async()=>{
    if(props.fileId){
      const res = await axios.get(`${backendURL}/api/files/download/${props.fileId}`, { responseType: "blob" })

      const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${dataBase.fileName}`;
      // link.download = res.headers["content-disposition"].split("filename=")[1];
      link.click();
      link.removeChild()
    }
  }
  return (
    <div className='w-full min-h-12 flex justify-center my-3'>

        {
            role === "sender" && dataBase?
        
            <div className='w-[95%] flex justify-end'>
              {
                dataBase?.type === "image"?
                <div className='max-w-[30rem] h-60'>
                  <img className="h-full rounded-lg" src={file} alt="" />
                </div>
                :
              
              <div className='max-w-[30rem]  min-h-40 rounded-3xl bg-accent-color text-accent-complementary flex flex-col gap-3 items-center px-4 py-2'>
                  <div className='w-[90%]  flex gap-4 items-center mt-3'>
                    <div className='max-w-[30%]  text-5xl'>
                        <i className="fa-solid fa-file"></i>
                    </div>
                    <div>
                        <span className='font-semibold text-2xl'>{dataBase?.title}</span>
                    </div>
                  </div>
                  <div className='w-[90%]'>
                    <h1 className='font-semibold text-lg'>Description</h1>
                    <span>{dataBase?.description}</span>
                  </div>
                  <div className='w-[90%] mb-3'>
                    <button className='w-36 h-10 rounded-lg text-accent-color bg-accent-complementary'
                      onClick={downloadFile}
                    >Download</button>
                  </div>
              </div>
              }  
            </div> 
            :
            <div className='w-[95%] flex justify-start'>
            {
                dataBase?.type === "image"?
                <div className='max-w-[30rem] h-60'>
                  <img className="h-full rounded-lg" src={file} alt="" />
                </div>
                :
              <div className='max-w-[30rem]  min-h-40 rounded-3xl bg-primary-color text-primary-complementary flex flex-col gap-3 items-center px-4 py-2'>
                  <div className='w-[90%]  flex gap-4 items-center mt-3'>
                    <div className='max-w-[30%] text-accent-color text-5xl'>
                        <i className="fa-solid fa-file"></i>
                    </div>
                    <div>
                        <span className='font-semibold text-2xl'>{dataBase?.title}</span>
                    </div>
                  </div>
                  <div className='w-[90%]'>
                    <h1 className='font-semibold text-lg'>Description</h1>
                    <span>{dataBase?.description}</span>
                    </div>
                  <div className='w-[90%] mb-3'>
                    <button className='w-36 h-10 rounded-lg bg-accent-color text-accent-complementary'
                      onClick={downloadFile}
                    >Download</button>
                  </div>
              </div>  
              
            }
            </div>  

        } 
    </div>
  )
}
