import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import '../css/draggableSkill.css';

function convertDifficultyToSkill(difficulty) {
    let value = difficulty * 10;
    return String.fromCharCode(65 + value - 1);
}

const DraggableSkill = ({ skill, index }) => {
    return (
        <Draggable key={skill.id} draggableId={skill.name} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="draggable-item" // Apply the CSS class
                    style={{
                        ...provided.draggableProps.style, // Maintain the styles from react-beautiful-dnd
                        ...provided.draggableProps.style, // Combine with the styles in the CSS class
                    }}
                >
                    <div className="circle">{(skill.apparatus !== "Vault" ? convertDifficultyToSkill(skill.difficulty) : skill.difficulty)}</div>
                    <p style={{ margin: 0, flex: 1, textAlign: 'center' }}>{skill.name}</p>
                </div>
            )}
        </Draggable>
    );
};

export default DraggableSkill;
