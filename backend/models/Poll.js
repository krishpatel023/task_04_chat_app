import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
  {
    description: {
      type: String,
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
    },
    options: [],
    membersVoted : [{
        type : String,
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Poll", PollSchema);