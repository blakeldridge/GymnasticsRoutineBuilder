import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './components/HomePage';
import ApparatusSelector from './components/ApparatusSelector';
import RoutineBuilder from './components/RoutineBuilder';
import ProfilePage from './components/ProfilePage';
import Login from './components/LogIn';
import Signup from './components/Signup';

import texture from './images/bg-texture.png';

import "./css/App.css";

const AppContent = () => {
    const location = useLocation(); // Get the current path
    // && location.pathname !== '/log-in' && location.pathname !== '/sign-up'

    return (
        <div className="app-background">
            
            {location.pathname !== '/'? (
                <Navbar />
            ) : null}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/log-in" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/apparatus-selector" element={<ApparatusSelector />} />
                <Route path="/apparatus-selector/floor/:id?" element={<RoutineBuilder apparatus="Floor" />} />
                <Route path="/apparatus-selector/pommel-horse/:id?" element={<RoutineBuilder apparatus="Pommel Horse" />} />
                <Route path="/apparatus-selector/rings/:id?" element={<RoutineBuilder apparatus="Rings" />} />
                <Route path="/apparatus-selector/vault/:id?" element={<RoutineBuilder apparatus="Vault" />} />
                <Route path="/apparatus-selector/parallel-bars/:id?" element={<RoutineBuilder apparatus="Parallel Bars" />} />
                <Route path="/apparatus-selector/high-bar/:id?" element={<RoutineBuilder apparatus="High Bar" />} />
            </Routes>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
