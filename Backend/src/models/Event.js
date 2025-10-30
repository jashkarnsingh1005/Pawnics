import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  maxParticipants: { type: Number, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);


