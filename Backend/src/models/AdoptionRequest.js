import mongoose from "mongoose";

const adoptionRequestSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'not_accepted'],
    default: 'pending'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("AdoptionRequest", adoptionRequestSchema);