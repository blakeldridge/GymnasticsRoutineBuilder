import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import '../css/draggableSkill.css';

function convertDifficultyToSkill(difficulty) {
    let value = difficulty * 10;
    return String.fromCharCode(65 + value - 1);
}

const Placeholder = ({ routine, apparatus, index, onRemove, onConnect }) => {
    const isConnected = routine[index]?.connection;
    const isNextConnected = routine[index - 1]?.connection;
    const connectionColor = routine[index]?.connectionColor || routine[index - 1]?.connectionColor || 'green';

    return (
        <div style={{ position: 'relative' }}>
            <Droppable key={index} droppableId={`routine-slot-${index}`} isDropDisabled={!!routine[index]}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            //position: 'relative',
                            minHeight: '80px',
                            backgroundColor: routine[index] ? 'var(--surface-color)' : snapshot.isDraggingOver ? 'var(--hover-color)' : 'var(--hover-color)',
                            border: snapshot.isDraggingOver ? '2px solid var(--hover-color)' : '1px dashed var(--surface-color)',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: routine[index] ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
                            transition: 'var(--background-color) 0.3s ease, border 0.3s ease',
                            color: 'var(--secondary-text-color)',
                            outline: isConnected || isNextConnected ? `2px solid ${connectionColor}` : 'none', // Add outline if connected
                            marginRight: isConnected && routine[index + 1] ? '-4px' : '0', // Overlap boxes if connected
                        }}
                    >
                        {routine[index] ? (
                            <>
                                <Draggable draggableId={routine[index].id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="draggable-item"
                                            style={{
                                                width: '100%',
                                                position: 'relative',
                                                padding: '16px',
                                                backgroundColor: 'var(--hover-color)',
                                                border: '1px solid var(--surface-color)',
                                                borderRadius: '4px',
                                                textAlign: 'center',
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            <div className="circle">{(routine[index].apparatus !== "Vault" ? convertDifficultyToSkill(routine[index].difficulty) : routine[index].difficulty)}</div>
                                            <p style={{ margin: 0, flex: 1, textAlign: 'center' }}>{routine[index].name}</p>
                                        </div>
                                    )}
                                </Draggable>
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
                                {(apparatus === "Floor" || apparatus === "Horizontal Bar") && routine[index + 1] ? (
                                    <button
                                        onClick={() => onConnect(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '-5px',
                                            transform: 'translateY(-50%)',
                                            backgroundColor: isConnected ? 'red' : 'gray',
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
                                        {isConnected ? '-' : '+'}
                                    </button>
                                ) : null}
                            </>
                        ) : (
                            <p>Place Skill Here</p>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Placeholder;
