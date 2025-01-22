import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Home from './components/Home'
import Login from './components/Login'
import MyCards from './components/MyCards'
import About from './components/About'
import Navbar from './components/Navbar';
import FavCards from './components/FavCards';
import Register from './components/Register';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import CardPage from './components/CardPage';
import Footer from './components/Footer';
import themes from '../customHooks/darkmode';

export let SiteTheme = createContext();

function App() {
  const [darkmode, setDarkmode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(jwtDecode(token));
    }
  }, []);

  return (
    <div style={{ backgroundColor: darkmode ? '#3D3D3D' : '#E4F2FD', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Router>
        <SiteTheme.Provider value={darkmode ? themes.dark : themes.light}>
          <Navbar setSearchQuery={setSearchQuery} user={user} setUser={setUser} darkmode={darkmode} setDarkmode={setDarkmode} />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkmode ? 'dark' : 'light'}
            transition={Slide}
          />
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/home" element={<Home searchQuery={searchQuery} />} />
            <Route path="/home/:cardId" element={<CardPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile setUser={setUser} darkmode={darkmode} />} />
            <Route path="/my-cards" element={<MyCards searchQuery={searchQuery} />} />
            <Route path="/fav-cards" element={<FavCards searchQuery={searchQuery} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer user={user} setUser={setUser} />
        </SiteTheme.Provider>
      </Router>


    </div >
  )
}

export default App
