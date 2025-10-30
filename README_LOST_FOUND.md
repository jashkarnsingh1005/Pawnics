# Lost & Found Pets Feature - Setup Guide

## Overview
This guide covers the setup and usage of the new Lost & Found Pets feature added to your MERN stack Pet NGO website.

## Features Added

### 🔍 **Lost & Found Main Page** (`/lost-found`)
- Browse lost and found pets with advanced filtering
- Report lost or found pets with photo upload
- Contact pet owners through integrated messaging
- Location-based search and reporting

### 📋 **My Reports Page** (`/lost-found/my-reports`)
- View all your reported pets
- Edit or delete your reports
- Mark pets as resolved
- Track report status

### 💬 **Real-time Messaging System**
- Socket.io powered real-time chat
- Contact owners about lost/found pets
- Integrated with existing Inbox system
- Message notifications and unread counts

### 🗺️ **Location Integration**
- Interactive map for location selection
- Current location detection
- Address geocoding
- Location-based filtering

## Installation & Setup

### Backend Dependencies
```bash
cd Backend
npm install multer socket.io
```

### Frontend Dependencies
```bash
cd Frontend
npm install socket.io-client
```

### Environment Setup
Ensure your `.env` file in the Backend directory contains:
```env
ACCESS_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
MONGO_URI=your_mongodb_connection_string
```

### File Upload Directory
The uploads directory has been created at:
```
Backend/uploads/lost-found-pets/
```

## Database Models

### LostFoundPet Schema
```javascript
{
  userId: ObjectId (ref: User),
  type: 'lost' | 'found',
  petName: String,
  petType: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other',
  breed: String,
  color: String,
  description: String,
  photo: String,
  contactInfo: {
    name: String,
    phone: String,
    email: String
  },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  status: 'active' | 'resolved' | 'inactive',
  timestamps: true
}
```

### LostFoundMessage Schema
```javascript
{
  petId: ObjectId (ref: LostFoundPet),
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  message: String,
  messageType: 'contact_owner' | 'found_pet' | 'general',
  isRead: Boolean,
  conversationId: String,
  timestamps: true
}
```

## API Endpoints

### Lost & Found Pets
- `GET /api/lost-found-pets` - Get all pets with filtering
- `POST /api/lost-found-pets` - Create new report (with file upload)
- `GET /api/lost-found-pets/my-reports` - Get user's reports
- `GET /api/lost-found-pets/pet/:id` - Get single pet
- `PUT /api/lost-found-pets/:id` - Update pet report
- `DELETE /api/lost-found-pets/:id` - Delete pet report
- `PATCH /api/lost-found-pets/:id/resolve` - Mark as resolved

### Messaging
- `POST /api/lost-found-messages` - Send message
- `GET /api/lost-found-messages/conversations` - Get user conversations
- `GET /api/lost-found-messages/conversation/:id` - Get conversation messages
- `GET /api/lost-found-messages/unread-count` - Get unread count
- `PATCH /api/lost-found-messages/conversation/:id/read` - Mark as read

## Usage Guide

### Reporting a Lost/Found Pet
1. Navigate to `/lost-found`
2. Click "Report Pet" tab
3. Fill out the form with pet details
4. Upload a clear photo of the pet
5. Use map integration to set location
6. Submit the report

### Browsing Pets
1. Use filters to narrow down search:
   - Type (Lost/Found)
   - Pet Type (Dog, Cat, etc.)
   - Breed
2. Click "Contact Owner" to send a message
3. Messages appear in the Inbox

### Managing Your Reports
1. Go to `/lost-found/my-reports`
2. Edit reports by clicking the edit button
3. Mark pets as resolved when found
4. Delete reports if needed

### Messaging System
1. Messages appear in Inbox under "Lost & Found Messages"
2. Real-time chat with Socket.io
3. Typing indicators and message status
4. Unread message notifications

## Socket.io Events

### Client Events
- `join_conversation` - Join a conversation room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server Events
- `receive_message` - Receive new message
- `user_typing` - Someone is typing
- `user_stop_typing` - Someone stopped typing

## File Structure

### Backend
```
Backend/src/
├── models/
│   ├── LostFoundPet.js
│   └── LostFoundMessage.js
├── controllers/
│   ├── LostFoundPetController.js
│   └── LostFoundMessageController.js
├── routes/
│   ├── LostFoundPetRoutes.js
│   └── LostFoundMessageRoutes.js
├── middleware/
│   └── authMiddleware.js
└── uploads/
    └── lost-found-pets/
```

### Frontend
```
Frontend/src/Components/LostFound/
├── LostFound.js
├── LostFound.module.css
├── MyReports.js
├── MyReports.module.css
├── LostFoundChat.js
├── LostFoundChat.module.css
├── MapIntegration.js
└── MapIntegration.module.css
```

## Running the Application

### Start Backend Server
```bash
cd Backend
npm run dev
```

### Start Frontend Development Server
```bash
cd Frontend
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Lost & Found: http://localhost:3000/lost-found

## Troubleshooting

### Common Issues

1. **File Upload Errors**
   - Ensure uploads directory exists and has write permissions
   - Check file size limits (5MB max)
   - Verify supported file types (jpg, png, gif)

2. **Socket.io Connection Issues**
   - Check CORS settings in backend
   - Verify Socket.io client version compatibility
   - Ensure server is running on correct port

3. **Location Features Not Working**
   - Enable location permissions in browser
   - For production, integrate with Google Maps API
   - Current implementation uses mock geocoding

4. **Database Connection**
   - Verify MongoDB connection string
   - Ensure database is running
   - Check network connectivity

## Production Considerations

### Security
- Implement file upload validation
- Add rate limiting for API endpoints
- Sanitize user inputs
- Use HTTPS in production

### Performance
- Add database indexes for search queries
- Implement image compression for uploads
- Use CDN for static file serving
- Add caching for frequently accessed data

### Map Integration
- Replace mock geocoding with real service
- Integrate Google Maps or Mapbox
- Add map visualization for pet locations
- Implement proximity-based search

## Support
For issues or questions about the Lost & Found feature, check the console logs and ensure all dependencies are properly installed.
