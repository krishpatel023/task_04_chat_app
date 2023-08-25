import Chat from '../models/Chat.js'
import User from '../models/User.js'
//ADD
export const createChat = async(req,res)=>{
    try{
        const newChat = new Chat({
            ...req.body
        })
        await newChat.save();
        await Promise.all (newChat.members.map((data)=>
            addChatToUser(data,newChat._id)
        ))
        res.status(200).send(newChat._id)

    }catch(error){
        res.status(400).send(error)
    }
}
const addChatToUser = async (userId, chatId) => {
    try {
        const curr = await User.findOne({userID : userId});
        const updatedUser = await User.findOneAndUpdate(
            { userID : userId},
            { $set : { chats : [chatId, ...curr.chats] }}
        )
    } catch (error) {
        console.log(error);
    }
}
//DELETE

//UPDATE (MAYBE)

//READ CHAT
export const getChat = async (req,res)=>{
    try{
        const renderedChat = await Chat.findById({ _id : req.params.chatId})
        res.status(200).send(renderedChat)
    }catch(error){
        res.status(400).send(error)   
    }
}
//UPDATE CHAT

export const updateChat = async (req,res) => {
    try{
        const updatedChat = await Chat.findOneAndUpdate(
            { _id : req.params.id},
            {$set: req.body})
        res.status(200).send(updatedChat)
    }catch(error){
        res.status(400).send(error)  
    }
}

//DELETE CHAT
export const deleteChat = async (req,res)=>{
    try{
        const deletedChat = await Chat.findByIdAndDelete({ _id : req.params.id })
        await Promise.all (deletedChat.members.map((member)=> removeChatFromUser(member, req.params.id)))
        res.status(200).send("USER DELETED")
    }catch(error){
        res.status(400).send(error)
    }
}

const removeChatFromUser = async (userId, chatId) => {
    try {
        const curr = await User.findOne({userID : userId});
        const newData = curr.chats.filter((item) => item !== chatId)
        const updatedUser = await User.findOneAndUpdate(
            { userID : userId},
            { $set : { chats : newData }}
        )
    } catch (error) {
        console.log(error);
    }
}

//DELETE MSG/FILE FROM CHAT

export const deleteMessage = async (req,res) => {
    try {
        const currentChat = await Chat.findByIdAndUpdate({ _id : req.params.id},{
            $set : { chatData : req.body.chatData}
        })
        res.status(200).send("MSG/FILE DELETED")
    } catch (error) {
        res.status(400).send(error)
    }
}