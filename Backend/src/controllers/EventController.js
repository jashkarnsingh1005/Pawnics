import Event from "../models/Event.js";
import jwt from "jsonwebtoken";

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, time, location, maxParticipants } = req.body;
    if (!name || !description || !date || !time || !location || !maxParticipants) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const ownerId = decoded.userId;

    const event = new Event({ name, description, date, time, location, maxParticipants, ownerId });
    await event.save();
    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllEvents = async (_req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const ownerId = decoded.userId;
    const events = await Event.find({ ownerId }).sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.ownerId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });
    const { name, description, date, time, location, maxParticipants } = req.body;
    event.name = name ?? event.name;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.time = time ?? event.time;
    event.location = location ?? event.location;
    event.maxParticipants = maxParticipants ?? event.maxParticipants;
    await event.save();
    res.status(200).json({ message: "Event updated", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.ownerId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


