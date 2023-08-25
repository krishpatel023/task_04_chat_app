import express from 'express';
import { addUnread, createUser, getAllUsers, getUser, getUserByEmail, removeUnread } from '../controllers/User.js';


const router = express.Router();

//CREATE
router.post("/createUser", createUser)
//EDIT
// router.put("/:id" ,updateUser)
// //DELETE
// router.delete("/:id",deleteUser)
//GET
router.get("/:id", getUser)
//GET
router.get("/byEmail/:emailId", getUserByEmail)
//GET ALL
router.get('/', getAllUsers)

//CHECK IF ALREADY EXISTS
// router.get("/checkIfAlreadyExists/:id", checkIfAlreadyExists)

//ADD UNREAD
router.put("/addUnread/:userId/:chatId", addUnread)
//REMOVE UNREAD
router.put("/removeUnread/:userId/:chatId", removeUnread)

export default router