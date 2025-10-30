import AdoptionRequest from "../models/AdoptionRequest.js";
import Pet from "../models/Pet.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Create a new adoption request
export const createAdoptionRequest = async (req, res) => {
  try {
    const { petId, message, reason, contactInfo } = req.body;
    
    // Validate required fields
    if (!petId || !message || !reason || !contactInfo) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const applicantId = decoded.userId;
    
    // Find pet to get owner ID
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    const ownerId = pet.ownerId;
    
    // Check if user is trying to adopt their own pet
    if (applicantId === ownerId.toString()) {
      return res.status(400).json({ message: "You cannot adopt your own pet" });
    }
    
    // Check if user has already submitted a request for this pet
    const existingRequest = await AdoptionRequest.findOne({ petId, applicantId });
    if (existingRequest) {
      return res.status(400).json({ message: "You have already submitted a request for this pet" });
    }
    
    // Create new adoption request
    const adoptionRequest = new AdoptionRequest({
      petId,
      applicantId,
      ownerId,
      message,
      reason,
      contactInfo,
      status: 'pending',
      date: new Date()
    });
    
    await adoptionRequest.save();
    
    res.status(201).json({ message: "Adoption request submitted successfully", adoptionRequest });
  } catch (error) {
    console.error("Error creating adoption request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get received adoption requests (for pet owner)
export const getReceivedRequests = async (req, res) => {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const ownerId = decoded.userId;
    
    // Find all requests where user is the pet owner
    const requests = await AdoptionRequest.find({ ownerId })
      .populate('petId')
      .populate('applicantId', 'name email');
    
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching received adoption requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get sent adoption requests (by current user)
export const getSentRequests = async (req, res) => {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const applicantId = decoded.userId;
    
    // Find all requests where user is the applicant
    const requests = await AdoptionRequest.find({ applicantId })
      .populate('petId')
      .populate('ownerId', 'name email');
    
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching sent adoption requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update adoption request status (accept/reject)
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['accepted', 'not_accepted'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    
    // Find request
    const request = await AdoptionRequest.findById(id);
    
    if (!request) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    
    // Check if user is the pet owner
    if (request.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }
    
    // Update request status
    request.status = status;
    await request.save();

    // If accepted, mark the pet as adopted
    if (status === 'accepted') {
      await Pet.findByIdAndUpdate(request.petId, { status: 'adopted' });
    }
    
    res.status(200).json({ message: "Adoption request updated successfully", request });
  } catch (error) {
    console.error("Error updating adoption request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all adoption requests for a specific pet
export const getRequestsByPet = async (req, res) => {
  try {
    const { petId } = req.params;
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    
    // Find pet
    const pet = await Pet.findById(petId);
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    // Check if user is the pet owner
    if (pet.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to view these requests" });
    }
    
    // Find all requests for this pet
    const requests = await AdoptionRequest.find({ petId })
      .populate('applicantId', 'name email');
    
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pet adoption requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an adoption request (only pet owner can delete)
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;

    const request = await AdoptionRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    if (request.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    await AdoptionRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Adoption request deleted successfully" });
  } catch (error) {
    console.error("Error deleting adoption request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
