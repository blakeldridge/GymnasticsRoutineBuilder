import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar,FaEdit } from 'react-icons/fa';
import floorIcon from '../images/floor-icon.PNG';
import pommelIcon from '../images/pommelhorse-icon.PNG';
import ringsIcon from '../images/rings-icon.PNG';
import vaultIcon from '../images/vault-icon.PNG';
import parallelBarsIcon from '../images/parallelbars-icon.PNG';
import highBarIcon from '../images/highbar-icon.PNG';
import '../css/RoutineTab.css';

const getApparatusIcon = (apparatus) => {
    switch (apparatus) {
        case "Floor":
            return floorIcon;
        case "Pommel Horse":
            return pommelIcon;
        case "Rings":
            return ringsIcon;
        case "Vault":
            return vaultIcon;
        case "Parallel Bars":
            return parallelBarsIcon;
        case "High Bar":
            return highBarIcon;
        default:
            return null;
    }
};

const RoutineTab = ({ routine, activeRoutine, setActive }) => {
    const [isFavourite, setFavourite] = useState(routine.isActive);
    const navigate = useNavigate();

    const toggleFavourite = () => {
        setFavourite(prev => !prev);
        setActive(!isFavourite);
    };

    const handleEditRoutine = () => {
        navigate(`/apparatus-selector/${routine.apparatus.toLowerCase().replace(/ /g, '-')}/${routine.id}`);
    };

    return (
        <div className="routine-entry">
            <div className="icon-container">  
                <img src={getApparatusIcon(routine.apparatus)} alt={routine.apparatus} />
            </div>
            <p className="routine-name">
                {routine.name ? routine.name : "No name"}
            </p>
            <div className="start-value-container">
                <h2>{JSON.parse(routine.difficulty)["Start Value"].toFixed(1)}</h2>
            </div>
            <div className="difficulty-breakdown-container">
                {Object.entries(JSON.parse(routine.difficulty)).map(([key, value], index) => {
                    if (key !== "Start Value") {
                        return (
                            <div className="difficulty-breakdown" key={key}>
                                <p className="difficulty-breakdown-value">{value}</p>
                            </div>
                        );
                    }
                })}
            </div>
            <p className="competition-text">Senior FIG</p>
            <div className="routine-interactive">
                <FaEdit 
                    onClick={handleEditRoutine}
                    className="edit-routine-button" 
                />
                {!activeRoutine && (
                    <FaStar 
                        onClick={toggleFavourite} 
                        className={`favourite-star ${isFavourite ? 'favourited' : 'not-favourited'}`} 
                    />
                )}
            </div>
        </div>
    );
};

export default RoutineTab;