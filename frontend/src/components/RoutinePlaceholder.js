import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FaPlus } from 'react-icons/fa';

import plus_icon from "../images/Plus.png";
import '../css/RoutinePlaceholder.css';

function convertDifficultyToSkill(difficulty) {
    let value = difficulty * 10;
    return String.fromCharCode(65 + value - 1);
}

function convertNumberToRoman(number) {
    switch (number) {
        case 1:
            return "I";
        case 2:
            return "II";
        case 3:
            return "III";
        case 4:
            return "IV";
        case 5:
            return "V";
        default:
            return "";
    }
}

const Placeholder = ({ routine, apparatus, index, onRemove, onConnect, onClick}) => {
    const [isHovered, setIsHovered] = useState(false); // State to track hover
    const [isMousePressed, setIsMousePressed] = useState(false); // State to track mouse press (down/up)
    const isConnected = routine[index]?.connection;
    const isNextConnected = routine[index - 1]?.connection;
    const connectionColor = routine[index]?.connectionColor || routine[index - 1]?.connectionColor || 'green';

    const handleMouseEnter = () => setIsHovered(true); // Set hover state to true
    const handleMouseLeave = () => setIsHovered(false); // Set hover state to false

    return (
        <div onClick={routine[index] ? null : () => onClick(index)} style={{ position: 'relative', height:'100%' }}>
            <Droppable key={index} droppableId={`routine-slot-${index}`} isDropDisabled={!!routine[index]}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onMouseEnter={handleMouseEnter}  // Track mouse enter
                        onMouseLeave={handleMouseLeave}  // Track mouse leave
                        className={`routine-slot-droppable ${snapshot.isDraggingOver ? 'hovering' : 'not-hovering'}` }
                        style={{
                            backgroundColor: routine[index]
                                ? 'var(--surface-color)'
                                : snapshot.isDraggingOver
                                ? 'var(--hover-color)'
                                : 'var(--hover-color)',
                            
                            outline: isConnected || isNextConnected ? `2px solid ${connectionColor}` : 'none',
                            marginRight: isConnected && routine[index + 1] ? '-4px' : '0',
                            transform: routine[index] ? "none" : (isHovered ? 'scale(1.05)' : 'none'),
                            transition: 'transform 0.2s ease', // Smooth transition
                        }}
                    >
                        {routine[index] ? (
                            <>
                                <Draggable draggableId={`${routine[index].name}-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="draggable-item-routine"
                                            style={{
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <div className="skill-name">
                                                <p>{routine[index].name}</p>
                                            </div>
                                            <div className="skill-data">
                                                <div className="skill-difficulty">
                                                    <p>{routine[index].apparatus !== 'Vault'
                                                    ? convertDifficultyToSkill(routine[index].difficulty)
                                                    : routine[index].difficulty}</p>
                                                </div>
                                                <div className="skill-group">
                                                    <p>Group {convertNumberToRoman(routine[index].group)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>

                                {isHovered && ( // Only show X button when hovering
                                    <button
                                        onClick={() => onRemove(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-8px',
                                            left: '-8px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        X
                                    </button>
                                )}

                                {(apparatus === 'Floor' || apparatus === 'High Bar') &&
                                routine[index + 1] && isHovered ? ( // Only show + button when hovering
                                    <button
                                        onClick={() => onConnect(index)}
                                        style={{
                                            backgroundColor: isConnected ? 'red' : 'gray',
                                        }}
                                        className="edit-skill-btn"
                                    >
                                        {isConnected ? '-' : '+'}
                                    </button>
                                ) : null}
                            </>
                        ) : (
                            <img src={plus_icon} className="add-skill-plus" />
                        )}

                        <div style={{display:"none"}}>
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Placeholder;