import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    senderId: {
      type : String,
      required: true,
    },
    chatId: {
      type : String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("File", FileSchema);