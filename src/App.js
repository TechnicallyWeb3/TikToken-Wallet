import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './css/App.css';
import Wallet from './components/Wallet';
import LookUp from './components/LookUp.js';
import Transactions from './components/Transactions.js';
import NavBar from './components/NavBar';
import MyWallet from './components/MyWallet';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar /> {/* Add the Navbar component */}
        <Routes>
          <Route path="/" element={<LookUp />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/txs" element={<Transactions />} />
          <Route path="/my-wallet" element={<MyWallet />} /> {/* Add the MyWallet component */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;