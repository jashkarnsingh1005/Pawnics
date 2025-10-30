import mongoose from "mongoose";

const lostFoundMessageSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostFoundPet',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['contact_owner', 'found_pet', 'general'],
    default: 'general'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Index for better query performance
lostFoundMessageSchema.index({ conversationId: 1, createdAt: 1 });
lostFoundMessageSchema.index({ receiverId: 1, isRead: 1 });
lostFoundMessageSchema.index({ petId: 1 });

export default mongoose.model("LostFoundMessage", lostFoundMessageSchema);
