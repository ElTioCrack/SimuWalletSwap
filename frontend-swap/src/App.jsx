import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AssetsList from './components/AssetsList';
import CreateOrder from './components/CreateOrder';
import Login from './pages/Login';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <h1>SimuWalletSwap</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/assets" element={<AssetsList />} />
          <Route path="/create-order" element={<CreateOrder />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
