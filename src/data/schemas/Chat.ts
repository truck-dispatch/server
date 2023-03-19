import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('Chat', schema);
