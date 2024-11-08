import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import UploadVideo from './pages/UploadVideo';
import Home from './pages/Home';
import Video from './pages/Video';
import Profile from './pages/Profile';
import Account  from './pages/Account';
import React, { useEffect } from 'react';
import Main from './pages/Main';
import ChangeProfile from './controller/ChangeProfile';
import Livestream from './pages/Livestream';
function App() {
  useEffect(() => {
    document.title = "Video sharing";
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/video" element={<Video />} />
        <Route path="/account" element={<Account />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/main" element={<Main />} />
        <Route path="/change" element={<ChangeProfile />} />
        <Route path="/livestream" element={<Livestream />} />
      </Routes>
    </Router>
    );
}


export default App;
