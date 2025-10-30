import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = async (req, res) => {
  try {
    console.log('Chatbot endpoint hit with message:', req.body);
    
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        response: "Hello! I'm your Pawnics assistant. How can I help you today?"
      });
    }

    // Provide intelligent responses without API dependency
    const responses = {
      greeting: [
        "Hello! I'm your Pawnics assistant. How can I help you today?",
        "Hi there! Welcome to Pawnics. What would you like to know about our pet services?",
        "Hey! I'm here to help with all your pet-related questions. What's on your mind?"
      ],
      adoption: [
        "Our adoption section features pets from local shelters looking for loving homes. You can browse by type, age, and location. Each pet has detailed profiles with photos and care information. Would you like to know more about the adoption process?",
        "Pet adoption through Pawnics is simple! Browse available pets, read their profiles, and submit an adoption request. Our team will connect you with the shelter for next steps."
      ],
      lostfound: [
        "Our Lost & Found feature helps reunite pets with families. You can report lost pets with photos and GPS location, or report found pets to help owners locate them. The system sends notifications when matches are found nearby.",
        "If you've lost a pet, report it immediately with a photo and last known location. If you've found a pet, please report it to help us reunite them with their family."
      ],
      volunteer: [
        "Join our volunteer events to help local pets! We organize community activities like pet care workshops, adoption drives, and shelter assistance. Check the Events section to see upcoming opportunities.",
        "Volunteering with Pawnics is rewarding! You can help with pet care, community outreach, and adoption events. Apply for events that match your interests and availability."
      ],
      general: [
        "Pawnics is your complete pet care platform. We offer adoption services, lost & found assistance, volunteer opportunities, and a community messaging system. What specific area interests you?",
        "I can help with pet adoption, lost & found reports, volunteer events, or general pet care advice. What would you like to explore?"
      ]
    };

    const lowerMessage = message.toLowerCase();
    let response;

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('adopt') || lowerMessage.includes('pet') && lowerMessage.includes('home')) {
      response = responses.adoption[Math.floor(Math.random() * responses.adoption.length)];
    } else if (lowerMessage.includes('lost') || lowerMessage.includes('found') || lowerMessage.includes('missing')) {
      response = responses.lostfound[Math.floor(Math.random() * responses.lostfound.length)];
    } else if (lowerMessage.includes('volunteer') || lowerMessage.includes('event') || lowerMessage.includes('help')) {
      response = responses.volunteer[Math.floor(Math.random() * responses.volunteer.length)];
    } else {
      response = responses.general[Math.floor(Math.random() * responses.general.length)];
    }

    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Provide a fallback response instead of error
    const fallbackResponse = `Hello! I'm your Pawnics assistant. I can help you with:

🐾 **Pet Adoption** - Browse available pets and learn about the adoption process
🔍 **Lost & Found** - Report missing pets or help reunite found pets with owners  
🤝 **Volunteer Events** - Join community activities and help local pets
💬 **General Pet Care** - Get advice on pet health, training, and care

What would you like to know about?`;

    res.json({ response: fallbackResponse });
  }
};

export { sendMessage };
