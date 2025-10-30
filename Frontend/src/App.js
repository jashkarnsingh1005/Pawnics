import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import HomePage from './Components/HomePage/HomePage';
import AboutUs from './Components/AboutUs/AboutUs';
import Adoption from './Components/Adoption/Adoption';
import PetDetails from './Components/Adoption/PetDetails';
import Inbox from './Components/Inbox/Inbox';
import Dashboard from './Components/Dashboard/Dashboard';
import ManagePets from './Components/Pets/ManagePets';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import AdminRoute from './Components/Auth/AdminRoute';
import Events from './Components/Events/Events';
import AdminEvents from './Components/Events/AdminEvents';
import LostFound from './Components/LostFound/LostFound';
import MyReports from './Components/LostFound/MyReports';
import LostFoundChat from './Components/Chat/LostFoundChat';
import Donation from './Components/Donation/Donation';
import Chatbot from './Components/Chatbot/Chatbot';

function App() {
  // const handleFilter = (e) => {
  //   const value = e.target.value;
  //   console.log('Search input:', value); // You can handle filtering logic here
  // };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
          <Route path="/adoption" element={<ProtectedRoute><Adoption /></ProtectedRoute>} />
          <Route path="/adoption/:id" element={<ProtectedRoute><PetDetails /></ProtectedRoute>} />
          <Route path="/manage-pets" element={<ProtectedRoute><ManagePets /></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/dashboard/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
          <Route path="/lost-found/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
          <Route path="/lost-found/chat/:conversationId" element={<ProtectedRoute><LostFoundChat /></ProtectedRoute>} />
          <Route path="/donation" element={<ProtectedRoute><Donation /></ProtectedRoute>} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
