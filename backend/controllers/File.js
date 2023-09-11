import File from '../models/File.js'
import Chat from '../models/Chat.js'
import User from '../models/User.js'
export const addFileOnly = async (req, res) => {
    try {
        const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1);
        var type = ""
        if(extension === 'pdf'){
            type = "document"
        }
        else{
            type = "image"
        }
        const newFile = new File({
            fileName : req.file.filename,
            type: type,
            title : req.body.title,
            description : req.body.description,
            senderId : req.body.senderId,
            chatId : "0"
        })
        await newFile.save();
        if(req.params.type === "chat"){
            try{
                await Chat.findOneAndUpdate(
                    { _id:req.params.id},
                    {$set: {img : newFile._id}})
            }catch(error){
                console.log(error);
            }
        }
        if(req.params.type === "user"){
            try{
                await User.findOneAndUpdate(
                    { userID : req.params.id},
                    {$set: {img : newFile._id}})
            }catch(error){
                console.log(error);
            }
        }
        if(req.params.type === "poll"){

        }
        res.status(200).send(newFile)
    } catch (error) {
        console.log(error);
    }
};
export const addItem = async (req, res) => {
    try {
        const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1);
        var type = ""
        if(extension === 'pdf'){
            type = "document"
        }
        else{
            type = "image"
        }
        const newFile = new File({
            fileName : req.file.filename,
            type: type,
            title : req.body.title,
            description : req.body.description,
            senderId : req.body.senderId,
            chatId : req.params.chatId
        })
        await newFile.save();
        addFileToChat(req.params.chatId, { ID : newFile._id, type : 'file'})
        res.status(200).send(newFile)
    } catch (error) {
        console.log(error);
    }
};
const addFileToChat = async (chatId, data) => {
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

export const downloadFile = async (req, res) => {
  const { id } = req.params;
  const item = await File.findById(id);
  if (!item) {
    return;
  }
  const file = item.fileName;
  const filePath = `../backend/localStorage/${file}`;
  res.download(filePath);
};
 
export const getFile = async (req, res) => {
    try {
      const items = await File.findById(req.params.msgId);
      res.status(200).send( items );
    } catch (error) {
      console.log(error);
    }
  };