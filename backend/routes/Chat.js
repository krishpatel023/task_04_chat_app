import express from 'express';
import { createChat, deleteChat, deleteMessage, getChat, updateChat } from '../controllers/Chat.js';


const router = express.Router();

//CREATE
router.post("/createChat", createChat)
//READ CHAT
router.get("/:chatId", getChat)
//UPDATE CHAT
router.put("/:id", updateChat)
//DELETE CHAT
router.delete("/:id", deleteChat)
//DELETE MSG/FILE
router.put("/deleteMsg/:id", deleteMessage)


export default router