import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
    },
    chats:[{
        type:String,
    }],
    unread: [{
      chatId : {
        type : String,
      },
      number : {
        type : Number,
      }
    }]
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);