import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import FloorIcon from '../icons/FloorIcon.js';
import PommelIcon from '../icons/PommelIcon.js';
import RingsIcon from '../icons/RingsIcon.js';
import VaultIcon from '../icons/VaultIcon.js';
import PbarIcon from '../icons/PbarIcon.js';
import HbarIcon from '../icons/HbarIcon.js';
import '../css/RoutineTab.css';

const getApparatusIcon = (apparatus) => {
    switch (apparatus) {
        case "Floor":
            return <FloorIcon />;
        case "Pommel Horse":
            return <PommelIcon />;
        case "Rings":
            return <RingsIcon />;
        case "Vault":
            return <VaultIcon />;
        case "Parallel Bars":
            return <PbarIcon />;
        case "High Bar":
            return <HbarIcon />;
        default:
            return null;
    }
};

const RoutineTab = ({ routine, collectionName, activeRoutine, setActive, onDelete }) => {
    const [isFavourite, setFavourite] = useState(routine.isActive);
    const navigate = useNavigate();

    useEffect(() => {
        //console.log(routine);
    }, [routine])

    const toggleFavourite = () => {
        setFavourite(prev => !prev);
        setActive(!isFavourite);
    };

    const handleDeleteRoutine = () => {
        onDelete(routine.id);
    };

    const handleEditRoutine = () => {
        navigate(`/apparatus-selector/${routine.apparatus.toLowerCase().replace(/ /g, '-')}/${routine.id}`);
    };

    return (
        <div className="routine-entry">
            {getApparatusIcon(routine.apparatus)}
            <p className="routine-name">
                {routine.name ? routine.name : "No name"}
            </p>
            <div className="start-value-container">
                <h2>{JSON.parse(routine.difficulty)["Start Value"].toFixed(1)}</h2>
            </div>
            <div className="difficulty-breakdown-container">
                {(() => {
                    // Parse difficulty breakdown just once
                    const difficultyBreakdown = JSON.parse(routine.difficulty);
                    
                    // Helper function to safely extract the value from a nested object
                    const getValue = (obj, key) => {
                        return obj && obj[key] && obj[key]["value"] ? parseFloat(obj[key]["value"]) : 0.0;
                    };

                    let values;
                    if (routine.apparatus === "Vault") {
                        const vault1 = getValue(difficultyBreakdown, "Vault 1");
                        const vault2 = getValue(difficultyBreakdown, "Vault 2");

                        values = [
                            vault1,
                            vault2,
                        ]
                    } else {
                        // Extract individual values with fallback to 0
                        const execution = getValue(difficultyBreakdown, "Execution");
                        const difficultySum = 
                            getValue(difficultyBreakdown, "Requirement") +
                            getValue(difficultyBreakdown, "Difficulty") +
                            getValue(difficultyBreakdown, "Bonus");
                        const penalty = getValue(difficultyBreakdown, "Penalty");
                        
                        // Map the extracted values into an array
                        values = [
                            execution, 
                            difficultySum, 
                            ...(penalty > 0 ? [penalty] : []) // Only add penalty if it's greater than 0
                        ];
                    }
                    
                    // Return the mapped JSX elements
                    return values.map((value, index) => (
                        <div className={`difficulty-breakdown colour-${index}`} key={index}>
                            <p className="difficulty-breakdown-value">{value.toFixed(1)}</p>
                        </div>
                    ));
                })()}
            </div>
            {collectionName ? (
                <p className="competition-text">{collectionName}</p>
            ) : null}
            {/*<p className="competition-text">Senior FIG</p>*/}
            <div className="routine-interactive">
                {routine.userId !== -1 ? (
                    <FaEdit 
                        onClick={handleEditRoutine}
                        className="edit-routine-button" 
                    />
                ) : (
                    <div className="edit-routine-placeholder"></div> // Placeholder div
                )}
                <FaTrash onClick={handleDeleteRoutine} className="edit-routine-button" />
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