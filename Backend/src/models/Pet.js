import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
    required: true
  },
  healthInfo: {
    type: String,
    default: 'No health information provided'
  },
  behavior: {
    type: String,
    default: 'No behavior information provided'
  },
  status: {
    type: String,
    enum: ['available', 'adopted'],
    default: 'available'
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);