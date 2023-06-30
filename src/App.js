import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import Profile from './components/Profile';
import Transact from './components/Transact';
import Menu from './components/Menu';
import SearchBar from './components/SearchBar';
import Transactions from './components/Transactions.js';
import NavBar from './components/NavBar';
import MyWallet from './components/MyWallet';

function App() {
  return (
    <Router>
      <div className="App">
        <SearchBar /> 
        {/* <Menu /> Add the Navbar component */}
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/transact" element={<Transact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;