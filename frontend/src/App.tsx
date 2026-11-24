import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Workout from './pages/Workout';
import './styles/App.css';
import {useAuth} from './provider/AuthProvider';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  // Wait for the refresh-cookie check before deciding where to send the user.
  if (status === 'loading') return <p role="status">Checking your session...</p>;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <NavLink className="brand" to="/" aria-label="Form home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>FORM<span className="brand-period">.</span></span>
        </NavLink>
        {/* If user is not authed - render login/signup options */}
        {!(useAuth().status === 'authenticated') && (
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </nav>
        )}
        {/* Render below options if user is authed */}
        {useAuth().status === 'authenticated' && (
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/workout">Workout</NavLink>
          </nav>
        )}
        <span className="header-status"><i /> FITNESS TRACKER</span>
      </header>

      <Routes>
        <Route path="/signup" element={<Home />} />
        <Route path="/login" element={<Home />} />
        {/* Authed Routes for User-specific content*/}
        <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/workout" element={<RequireAuth><Workout /></RequireAuth>} />
        <Route path="/progress" element={<RequireAuth><Workout /></RequireAuth>} />   
        <Route path="*" element={<RequireAuth><Home /></RequireAuth>} />
      </Routes>

      <footer className="app-footer">
        <span>FORM<span className="brand-period">.</span></span>
        <span>Personal training log</span>
      </footer>
    </div>
  );
}

export default App;
