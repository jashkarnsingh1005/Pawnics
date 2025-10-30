import mongoose from "mongoose";

const eventApplicationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserData', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  notes: { type: String, trim: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('EventApplication', eventApplicationSchema);


