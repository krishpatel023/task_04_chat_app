import express from 'express';
import { createMsg, getMsg } from '../controllers/Message.js';


const router = express.Router();

//CREATE
router.post("/createMsg/:chatId", createMsg)
//READ CHAT
router.get("/:msgId", getMsg)

export default router