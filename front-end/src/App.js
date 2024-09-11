import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './components/HomePage';
import RoutinePage from './components/RoutinePage';
import DevPanel from './components/DevPanel';
import RoutineBuilder from './components/RoutineDragTest';
import ProfilePage from './components/ProfilePage';
import Login from './components/LogIn';
import Signup from './components/Signup';
import "./css/App.css";

const AppContent = () => {
    const location = useLocation(); // Get the current path

    return (
        <div>
            {location.pathname !== '/' && location.pathname !== '/log-in' && location.pathname !== 'sign-up'? (
                <Navbar />
            ) : null}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/log-in" element={<Login />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/apparatus-selector" element={<RoutinePage />} />
                <Route path="/dev-panel" element={<DevPanel />} />
                <Route path="/apparatus-selector/floor/:id?" element={<RoutineBuilder apparatus="Floor" />} />
                <Route path="/apparatus-selector/pommel-horse/:id?" element={<RoutineBuilder apparatus="Pommel Horse" />} />
                <Route path="/apparatus-selector/still-rings/:id?" element={<RoutineBuilder apparatus="Still Rings" />} />
                <Route path="/apparatus-selector/vault/:id?" element={<RoutineBuilder apparatus="Vault" />} />
                <Route path="/apparatus-selector/parallel-bars/:id?" element={<RoutineBuilder apparatus="Parallel Bars" />} />
                <Route path="/apparatus-selector/horizontal-bar/:id?" element={<RoutineBuilder apparatus="Horizontal Bar" />} />
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
