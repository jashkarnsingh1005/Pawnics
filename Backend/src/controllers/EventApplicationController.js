import Event from "../models/Event.js";
import EventApplication from "../models/EventApplication.js";
import jwt from "jsonwebtoken";

export const applyToEvent = async (req, res) => {
  try {
    const { eventId, name, email, contact, notes } = req.body;
    if (!eventId || !name || !email || !contact) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const applicantId = decoded.userId;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.ownerId.toString() === applicantId) {
      return res.status(400).json({ message: "Owner cannot apply to own event" });
    }
    const exists = await EventApplication.findOne({ eventId, applicantId });
    if (exists) return res.status(400).json({ message: "Already applied" });
    const application = new EventApplication({
      eventId,
      applicantId,
      ownerId: event.ownerId,
      name, email, contact, notes,
      status: 'pending'
    });
    await application.save();
    res.status(201).json({ message: "Application submitted", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyEventApplications = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const ownerId = decoded.userId;
    const apps = await EventApplication.find({ ownerId })
      .populate('eventId')
      .populate('applicantId', 'name email');
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMySubmittedEventApplications = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const applicantId = decoded.userId;
    const apps = await EventApplication.find({ applicantId })
      .populate('eventId')
      .populate('ownerId', 'name email');
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEventApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted', 'declined'].includes(status)) return res.status(400).json({ message: "Invalid status" });
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    const app = await EventApplication.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.ownerId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });
    app.status = status;
    await app.save();
    res.status(200).json({ message: "Application updated", application: app });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteEventApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    const app = await EventApplication.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (app.ownerId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });
    await EventApplication.findByIdAndDelete(id);
    res.status(200).json({ message: "Application deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


