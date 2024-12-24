import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FaPlus } from 'react-icons/fa';
import '../css/draggableSkill.css';

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

const DraggableSkill = ({ skill, index, disabled, onAddSkill }) => {
    return (
        <Draggable key={skill.id} draggableId={skill.name} index={index} isDragDisabled={disabled}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`draggable-item ${disabled ? 'disabled' : ''}`} // Apply the disabled class conditionally
                    style={{
                        border: skill.isFlop ? "4px solid var(--accent-highlight-color)" : 0,
                        ...provided.draggableProps.style, // Maintain the styles from react-beautiful-dnd
                        // Remove the duplicate spread and make sure to only use provided.draggableProps.style once
                    }}
                >
                    <div className="circle">{(skill.apparatus !== "Vault" ? convertDifficultyToSkill(skill.difficulty) : skill.difficulty)}</div>
                    <p style={{ margin: 0, flex: 1, textAlign: 'center' }}>{skill.name}</p>
                    <p style={{ "margin-right":"5%"}}>EG {convertNumberToRoman(skill.group)}</p>
                    <FaPlus
                        onClick={!disabled ? () => onAddSkill(skill) : undefined}  // Disable click if disabled
                        className={disabled ? 'add-skill-button-disabled' : 'add-skill-button'}  // Add disabled class if disabled
                    />
                </div>
            )}
        </Draggable>
    );
};

export default DraggableSkill;
