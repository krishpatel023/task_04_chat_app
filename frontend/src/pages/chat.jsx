import React, { useContext } from 'react'
import PanelSection from '../components/Panel/PanelSection'
import ChatSection from '../components/Chat/ChatSection'
import GlobalContext from '../context/GlobalContext'
import ChatDetails from '../components/ChatDetails/ChatDetails'
export default function Chat() {
  const {chatSettings} = useContext(GlobalContext)
  return (
    <div className='w-screen h-screen bg-secondary-color flex'>
        <div className='w-[25%] h-full'>
            <PanelSection/>
        </div>
        <div className='w-[75%] h-full'>
        {
          chatSettings?
          <ChatDetails/>
          :
          <ChatSection/>
        }   
        </div>
    </div>
  )
}
