import mongoose from "mongoose";

const lostFoundPetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserData',
    required: true
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  petName: {
    type: String,
    required: true,
    trim: true
  },
  petType: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other']
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  photo: {
    type: String,
    required: true
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'inactive'],
    default: 'active'
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for better search performance
lostFoundPetSchema.index({ type: 1, petType: 1, breed: 1, status: 1 });
lostFoundPetSchema.index({ location: '2dsphere' });
lostFoundPetSchema.index({ userId: 1 });

export default mongoose.model("LostFoundPet", lostFoundPetSchema);
