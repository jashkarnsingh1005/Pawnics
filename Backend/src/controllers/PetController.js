import Pet from "../models/Pet.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Create a new pet
export const createPet = async (req, res) => {
  try {
    const { name, breed, age, color, description, photo, healthInfo, behavior } = req.body;
    
    // Validate required fields
    if (!name || !breed || !age || !color || !description || !photo) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const ownerId = decoded.userId;
    
    // Create new pet
    const pet = new Pet({
      name,
      breed,
      age,
      color,
      description,
      photo,
      healthInfo: healthInfo || "No health information provided",
      behavior: behavior || "No behavior information provided",
      ownerId
    });
    
    await pet.save();
    
    res.status(201).json({ message: "Pet added successfully", pet });
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all pets
export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('ownerId', 'name email');
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get pets by owner ID
export const getPetsByOwner = async (req, res) => {
  try {
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const ownerId = decoded.userId;
    
    const pets = await Pet.find({ ownerId });
    res.status(200).json(pets);
  } catch (error) {
    console.error("Error fetching owner's pets:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get pet by ID
export const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate('ownerId', 'name email');
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    res.status(200).json(pet);
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update pet
export const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, age, color, description, photo, healthInfo, behavior } = req.body;
    
    // Get user ID from token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access Token missing" });
    }
    
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    const userId = decoded.userId;
    
    // Find pet
    const pet = await Pet.findById(id);
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    // Check if user is the owner
    if (pet.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this pet" });
    }
    
    // Update pet
    pet.name = name || pet.name;
    pet.breed = breed || pet.breed;
    pet.age = age || pet.age;
    pet.color = color || pet.color;
    pet.description = description || pet.description;
    pet.photo = photo || pet.photo;
    pet.healthInfo = healthInfo || pet.healthInfo;
    pet.behavior = behavior || pet.behavior;
    
    await pet.save();
    
    res.status(200).json({ message: "Pet updated successfully", pet });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete pet
export const deletePet = async (req, res) => {
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
    
    // Find pet
    const pet = await Pet.findById(id);
    
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    
    // Check if user is the owner
    if (pet.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this pet" });
    }
    
    await Pet.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};