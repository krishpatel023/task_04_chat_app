import User from '../models/User.js'


//CREATE USER
export const createUser = async(req,res)=>{
    
    try{
        const newUser = new User({
            ...req.body
        })
        await newUser.save();
        res.status(200).send("New User Created!")

    }catch(error){
        res.status(400).send(error)
    }
}
//EDIT USER
export const updateUser = async (req,res)=>{
    try{

        const updatedUser = await User.findOneAndUpdate(
            { userID:req.params.id},
            {$set: req.body})
        res.status(200).send("USER UPDATED")
    }catch(error){
        res.status(400).send(error.message)
    }
}

//DELETE USER
export const deleteUser = async (req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete({ userID : req.params.id })
        res.status(200).send("USER DELETED")
    }catch(error){
        res.status(400).send(error)
    }
}
//VIEW SPECIFIC USER BY EMAIL
export const getUser = async (req,res)=>{
    try{
        const renderedUser = await User.findOne({ userID : req.params.id})
        res.status(200).send(renderedUser)
    }catch(error){
        res.status(400).send(error)   
    }
}

//VIEW SPECIFIC USER BY EMAIL
export const getUserByEmail = async (req,res)=>{
    try{
        const renderedUser = await User.findOne({ email : req.params.emailId})
        res.status(200).send(renderedUser)
    }catch(error){
        res.status(400).send(error)   
    }
}

//GET USER CHATS
export const getUserChats = async (req,res)=>{
    try{
        const renderedUser = await User.findOne({ userID : req.params.id})
        res.status(200).send(renderedUser.chats)
    }catch(error){
        res.status(400).send(error)   
    }
}
//VIEW ALL USERS
export const getAllUsers = async (req,res)=>{
    try{
        const allUsers = await User.find()
        res.status(200).send(allUsers)
    }catch(error){
        res.status(400).send(error)
    }
}
//CHECK IF ALREADY EXISTS
export const checkIfAlreadyExists = async (req, res)=>{
    try{
        const renderedUser = await User.findOne({ userID : req.params.id})
        if(renderedUser){
            res.status(200).send(true)
        }
        else{
            res.status(200).send(false)
        }
        
    }catch(error){
        res.status(400).send(error)   
    }
}

//ADD UNREAD

export const addUnread = async (req,res)=>{
    console.log("FUNC CALLED");
    try{
        const user = await User.findOne({ userID : req.params.userId })
        const myUnread = user.unread
        var chatData = ""

        for(var i=0; i<user.unread.length; i++){
            if(user.unread[i].chatId === req.params.chatId){
                chatData = user.unread[i];
                break;
            }
        }

        if(chatData === ""){
            //add
            await User.findOneAndUpdate(
                { userID:req.params.userId},
                {
                    $set: { unread : [...user.unread , req.body]}
                }
            )
        }
        if(chatData !== ""){
            //addOne
            const myData = myUnread.map(data => {
                if(data.chatId === req.params.chatId){
                    data.number = data.number + 1
                }
                return data;
            }
            )
            await User.findOneAndUpdate(
                { userID:req.params.userId},
                {
                    $set: { unread : myData}
                }
            )
        }
        res.status(200).send("USER UPDATED")
    }catch(error){
        res.status(400).send(error.message)
    }
}

//REMOVE UNREAD

export const removeUnread = async (req,res)=>{
    try{
        const user = await User.findOne({ userID : req.params.userId })
        const myUnread = user.unread

        var chatData = ""

        for(var i=0; i<user.unread.length; i++){
            if(user.unread[i].chatId === req.params.chatId){
                chatData = user.unread[i];
                break;
            }
        }

        if(chatData === ""){
            //NOTHING
        }
        if(chatData !== ""){
            const myData = myUnread.filter(function(item) {
                return item.chatId !== req.params.chatId
            })
            await User.findOneAndUpdate(
                { userID:req.params.userId},
                {
                    $set: { unread : myData}
                }
            )
        }

        res.status(200).send("USER DELETED")
    }catch(error){
        res.status(400).send(error)
    }
}