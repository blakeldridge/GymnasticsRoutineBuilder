import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import getApparatusIcon from '../utils/apparatusIconGetter';
import '../css/RoutineTab.css';

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
            <div className="routine-apparatus-icon">
                {getApparatusIcon(routine.apparatus)}
            </div>
            <div className="routine-metadata-container">
                <div className="routine-info-container">
                    <p className="routine-name">
                        {routine.name ? routine.name : "No name"}
                    </p>
                    {collectionName ? (
                        <p className="collection-text">{collectionName}</p>
                    ) : null}
                </div>
                <div className="routine-difficulty-container">
                    <div className="routine-start-value-container">
                        <p>{JSON.parse(routine.difficulty)["Start Value"].toFixed(1)}</p>
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
                                <div className={`difficulty-breakdown`} key={index}>
                                    <p className="difficulty-breakdown-value">{value.toFixed(1)}</p>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>
            {/*<p className="competition-text">Senior FIG</p>*/}
            <div className="routine-interactive">
                {routine.userId !== -1 ? (
                    <>
                    <FaEdit 
                        onClick={handleEditRoutine}
                        className="edit-routine-button" 
                    />
                    <FaTrash onClick={handleDeleteRoutine} className="edit-routine-button" />
                    </>
                ) : (
                    <div className="edit-routine-placeholder"></div> // Placeholder div
                )}
            </div>

        </div>
    );
};

export default RoutineTab;