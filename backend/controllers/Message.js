import Message from '../models/Message.js'
import Chat from '../models/Chat.js'

//ADD MESSAGE

export const createMsg = async(req,res)=>{
    try{
        const newMessage = new Message({
            ...req.body
        })
        await newMessage.save();
        addMsgToChat(req.params.chatId, { ID : newMessage._id, type : 'message'})
        res.status(200).send(newMessage)

    }catch(error){
        res.status(400).send(error)
    }
}
const addMsgToChat = async (chatId, data) => {
    try {
        const curr = await Chat.findById({_id : chatId});
        const updatedChat = await Chat.findOneAndUpdate(
            { _id : chatId},
            { $set : { chatData : [...curr.chatData, data] }}
        )
    } catch (error) {
        console.log(error);
    }
}

//READ MSG
export const getMsg = async (req,res)=>{
    try{
        const renderedMessage = await Message.findById({ _id : req.params.msgId})
        res.status(200).send(renderedMessage)
    }catch(error){
        res.status(400).send(error)   
    }
}
