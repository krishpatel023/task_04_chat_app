// import { upload } from '../middleware/Multer.js';
import express from 'express'
import multer from 'multer';
import { getFile, addItem, downloadFile, addFileOnly }  from "../controllers/File.js";

const router = express.Router();
// const upload = multer({ dest : "localStorage/"})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //where to store the file
        return cb(null, "localStorage/");
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        return cb(null, createRandom(20)+"."+extension);
    },
});

function createRandom(lengthOf){
    var randomString = ''
    var Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789'
    for (var i =0 ; i < lengthOf ; i++){
        randomString += Characters.charAt(Math.floor(Math.random() * Characters.length))
    }
    return randomString
}

const upload = multer({storage})

router.post("/:chatId", upload.single("file"), addItem);
router.post("/uploadFile/:type/:id", upload.single("file"), addFileOnly);
router.get("/download/:id", downloadFile);
router.get("/:msgId", getFile)

export default router;