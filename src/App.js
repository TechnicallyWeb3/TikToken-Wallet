import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import { AppProvider } from './AppContext'; // Import the AppProvider from AppContext.js
import Profile from './components/Profile';
import Transact from './components/Transact';
import NavMenu from './components/NavMenu';
import SearchBar from './components/SearchBar';
import Landing from './components/Landing';

function App() {
  const [showInput, setShowInput] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showNav, setShowNav] = useState(windowWidth >= 550);

  const toggleSearchBar = () => {
    setShowInput(!showInput);
    if (!showNav) {
      setShowNav(showInput);
    }
  };

  const handleResize = () => {
    const newWidth = window.innerWidth;
    setWindowWidth(newWidth);
    if (newWidth >= 550) {
      setShowNav(true);
    } else {
      if (showInput) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AppProvider> {/* Wrap the entire app with the AppProvider */}
      <Router>
        <div className="App">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SearchBar showInput={showInput} toggleSearchBar={toggleSearchBar} />
            {!showInput && <NavMenu />}
          </div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transact" element={<Transact />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
