import Chat from '../models/Chat.js'
import Poll from '../models/Poll.js';


//CREATE
export const createPoll = async(req,res)=>{
    try{
        console.log(req.body);
        const newPoll = new Poll(req.body)
        await newPoll.save();
        addPollToChat(req.params.chatId, { ID : newPoll._id, type : 'poll'})
        res.status(200).send(newPoll)

    }catch(error){
        res.status(400).send(error)
    }
}
const addPollToChat = async (chatId, data) => {
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

//READ POLL

export const getPoll = async (req,res)=>{
    try{
        const renderedPoll = await Poll.findById({ _id : req.params.pollId})
        res.status(200).send(renderedPoll)
    }catch(error){
        res.status(400).send(error)   
    }
}

//UPDATE VOTE

export const updatePoll = async (req,res)=>{
    try{
        //OPTION ID, VOTER ID, POLL ID
        const renderedPoll = await Poll.findById({ _id : req.body.pollId})

        for(var i=0;i<renderedPoll.options.length;i++){
            if(renderedPoll.options[i].id === req.body.optionId){
                renderedPoll.options[i].vote = renderedPoll.options[i].vote + 1
                renderedPoll.options[i].peopleVoted = [...renderedPoll.options[i].peopleVoted, req.body.voterId]
                break
            }
        }
        renderedPoll.membersVoted = [...renderedPoll.membersVoted, req.body.voterId]

        await Poll.findOneAndUpdate(
            { _id : req.body.pollId},
            { $set : { options : renderedPoll.options, membersVoted : renderedPoll.membersVoted}}
        )
        res.status(200).send("UPDATED POLL")
    }catch(error){
        res.status(400).send(error)   
    }
}