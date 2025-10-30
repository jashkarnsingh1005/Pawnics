import LostFoundPet from '../models/LostFoundPet.js';
import LostFoundMessage from '../models/LostFoundMessage.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/lost-found-pets/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create a new lost/found pet report
export const createLostFoundPet = async (req, res) => {
  try {
    const { type, petName, petType, breed, color, description, contactInfo, location } = req.body;
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Pet photo is required' });
    }

    const newPet = new LostFoundPet({
      userId,
      type,
      petName,
      petType,
      breed,
      color,
      description,
      photo: req.file.path,
      contactInfo: JSON.parse(contactInfo),
      location: JSON.parse(location)
    });

    const savedPet = await newPet.save();
    await savedPet.populate('userId', 'name email');
    
    res.status(201).json(savedPet);
  } catch (error) {
    console.error('Error creating lost/found pet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all lost/found pets with filtering
export const getLostFoundPets = async (req, res) => {
  try {
    const { type, petType, breed, status, lat, lng, radius = 10 } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (type) query.type = type;
    if (petType) query.petType = petType;
    if (breed) query.breed = new RegExp(breed, 'i');
    if (status) query.status = status;
    else query.status = 'active'; // Default to active pets only

    // Location-based filtering
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const pets = await LostFoundPet.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await LostFoundPet.countDocuments(query);

    res.json({
      pets,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPets: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching lost/found pets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's own lost/found pet reports
export const getUserLostFoundPets = async (req, res) => {
  try {
    const userId = req.user.id;
    const pets = await LostFoundPet.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(pets);
  } catch (error) {
    console.error('Error fetching user pets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single lost/found pet by ID
export const getLostFoundPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const pet = await LostFoundPet.findById(id).populate('userId', 'name email');
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update lost/found pet
export const updateLostFoundPet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    // Parse JSON strings if they exist
    if (updateData.contactInfo && typeof updateData.contactInfo === 'string') {
      updateData.contactInfo = JSON.parse(updateData.contactInfo);
    }
    if (updateData.location && typeof updateData.location === 'string') {
      updateData.location = JSON.parse(updateData.location);
    }

    // If new photo is uploaded
    if (req.file) {
      updateData.photo = req.file.path;
    }

    const pet = await LostFoundPet.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete lost/found pet
export const deleteLostFoundPet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pet = await LostFoundPet.findOneAndDelete({ _id: id, userId });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    // Also delete related messages
    await LostFoundMessage.deleteMany({ petId: id });

    res.json({ message: 'Pet report deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark pet as resolved
export const markPetResolved = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pet = await LostFoundPet.findOneAndUpdate(
      { _id: id, userId },
      { status: 'resolved', isResolved: true },
      { new: true }
    ).populate('userId', 'name email');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found or unauthorized' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error marking pet as resolved:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
