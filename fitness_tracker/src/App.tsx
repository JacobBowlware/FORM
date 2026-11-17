import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Workout from './Pages/Workout';
import './Styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="Form home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>FORM<span className="brand-period">.</span></span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/workout">Workout</NavLink>
        </nav>
        <span className="header-status"><i /> FITNESS TRACKER</span>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <footer className="app-footer">
        <span>FORM<span className="brand-period">.</span></span>
        <span>Personal training log</span>
      </footer>
    </div>
  );
}

export default App;
