import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import '../css/DifficultyBreakdown.css';

const DifficultyBreakdown = ({ calculate, id }) => {
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    const togglePanel = () => {
        setIsPanelVisible(!isPanelVisible);
    };

    const difficultyDetails = Object.entries(calculate() || {});

    return (
        <div className={`difficulty-block ${id ? 'logged-in' : 'logged-out'}`}>
            <div className="visible-info">
                {/* Always visible Start Value */}
                <div className="start-value-section">
                    {difficultyDetails.map(([key, value]) =>
                        key === "Start Value" ? (
                            <div className="start-value-container" key={key}>
                                <p className="start-value">{parseFloat(value).toFixed(2)}</p>
                            </div>
                        ) : null
                    )}
                </div>

                {/* Dropdown Toggle Button */}
                <div className="difficulty-dropdown">
                    <button className="dropdown-toggle" onClick={togglePanel}>
                        {isPanelVisible ? <FaChevronUp /> : <FaChevronDown />}
                        {/*isPanelVisible ? "Hide Breakdown" : "Show Breakdown"*/}
                    </button>
                </div>
            </div>


            {/* Downward Panel */}
            <div
                className={`difficulty-panel ${isPanelVisible ? "expanded" : ""}`}
            >
                {difficultyDetails.map(([key, value]) => {
                    if (key !== "Start Value") {
                        return (
                            <div key={key} className="difficulty-item">
                                <div className="difficulty-information">
                                    <p className="difficulty-key">{key}</p>
                                    <p className="difficulty-value">
                                        {parseFloat(value.value).toFixed(2)}
                                    </p>
                                </div>
                                <div className="difficulty-message">
                                    <p style={{whiteSpace : "pre-line"}}>{value.message}</p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default DifficultyBreakdown;
