import express from 'express';
import { createPoll, getPoll, updatePoll } from '../controllers/Poll.js';


const router = express.Router();

//CREATE
router.post("/createPoll/:chatId", createPoll)
//READ CHAT
router.get("/:pollId", getPoll)
//UPDATE POLL
router.put("/", updatePoll)


export default router