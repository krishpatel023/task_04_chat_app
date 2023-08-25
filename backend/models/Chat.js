import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    members:[{
        type:String,
    }],
    img: {
      type : String,
    },
    chatData : [{
      ID : {
        type : String,
      },
      type : {
        type : String,
      }
    }],
    admin : [{
      type : String,
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);