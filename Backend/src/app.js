
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

import authRoute from './routes/UserRoutes.js';
import petRoutes from './routes/PetRoutes.js';
import adoptionRequestRoutes from './routes/AdoptionRequestRoutes.js';
import eventRoutes from './routes/EventRoutes.js';
import eventApplicationRoutes from './routes/EventApplicationRoutes.js';
import lostFoundPetRoutes from './routes/LostFoundPetRoutes.js';
import lostFoundMessageRoutes from './routes/LostFoundMessageRoutes.js';
import chatbotRoutes from './routes/chatbot.js';
import cookieParser from 'cookie-parser';

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/auth", authRoute);
app.use("/api/pets", petRoutes);
app.use("/api/adoption-requests", adoptionRequestRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/event-applications", eventApplicationRoutes);
app.use("/api/lost-found-pets", lostFoundPetRoutes);
app.use("/api/lost-found-messages", lostFoundMessageRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Socket.io for real-time messaging
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join conversation room
    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation ${conversationId}`);
    });

    // Handle sending messages
    socket.on('send_message', (data) => {
        socket.to(data.conversationId).emit('receive_message', data);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        socket.to(data.conversationId).emit('user_typing', data);
    });

    socket.on('stop_typing', (data) => {
        socket.to(data.conversationId).emit('user_stop_typing', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectDB();
});
