import { React, useState } from 'react';
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

const DraggableSkill = ({ skill, index, disabled }) => {
    return (
        <div>
            <div
                className={`draggable-item ${disabled ? 'disabled' : ''}`} // Apply the disabled class conditionally
                style={{
                    border: skill.isFlop ? "4px solid var(--accent-highlight-color)" : 0,
                }}
            >
                <div className="draggable-difficulty">
                    <p>{(skill.apparatus !== "Vault" ? convertDifficultyToSkill(skill.difficulty) : skill.difficulty)}</p>
                </div>
                <p className="draggable-name">{skill.name}</p>
                <div className="draggable-group">
                    <p style={{ "margin-right":"5%"}}>Group {convertNumberToRoman(skill.group)}</p>
                </div>
            </div>
        </div>
        /*<Draggable key={skill.id} draggableId={skill.name} index={index} isDragDisabled={disabled}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`draggable-item ${disabled ? 'disabled' : ''}`} // Apply the disabled class conditionally
                    style={{
                        border: skill.isFlop ? "4px solid var(--accent-highlight-color)" : 0,
                        ...provided.draggableProps.style, // Maintain the styles from react-beautiful-dnd
                    }}
                >
                    <div className="draggable-difficulty">
                        <p>{(skill.apparatus !== "Vault" ? convertDifficultyToSkill(skill.difficulty) : skill.difficulty)}</p>
                    </div>
                    <p className="draggable-name">{skill.name}</p>
                    <div className="draggable-group">
                        <p style={{ "margin-right":"5%"}}>Group {convertNumberToRoman(skill.group)}</p>
                    </div>
                </div>
            )}
        </Draggable>*/
    );
};

export default DraggableSkill;
