import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    chatId: {
      type: String,
      required : true,
    },
    deletedAt: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);