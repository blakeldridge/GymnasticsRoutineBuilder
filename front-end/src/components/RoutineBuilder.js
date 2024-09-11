import React, { useState, useEffect } from 'react';
import { calculateDifficulty } from "../utils/calculateDifficulty";
import DraggableSkill from './DraggableSkill';

const RoutineBuilder = ({ apparatus }) => {
    const [routine, setRoutine] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetch(`/api/skills/by-apparatus/${apparatus}`)
            .then(response => response.json())
            .then(data => setSkills(data))
            .catch(error => console.error('Error fetching skills:', error));
    }, [apparatus]);

    const handleAddedSkill = async (id) => {
        fetch(`/api/skills/${id}`)
                .then(response => response.json())
                .then(data => addSkillToRoutine(data))
                .catch(error => console.error('Error fetching skills:', error));
    };

    const addSkillToRoutine = (skill) => {
        if (skill.apparatus != "Floor" && routine.length > 0 && routine[routine.length - 1].group == 4) {
            console.log("You can not add skills after a dismount!");
        } else if (routine.length >= 8) {
            console.log("A routine can only have 8 skills maximum!");
        } else if (routine.some(currentSkill => currentSkill.id === skill.id)){
            console.log("A skill can not be counted twice!");
        } else {
            setRoutine(prevRoutine => [...prevRoutine, skill]);
        }
    };

    const removeSkill = (index) => {
        setRoutine(prevRoutine => prevRoutine.filter((_, i) => i !== index));
    };

    const connectSkill = (index) => {
        routine[index].connection = true;
    }

    return (
        <div>
            <div>
                <div>
                    <button>&lt;</button>
                    <p>hello</p>
                    <h2>Skills:</h2>
                    <button>&gt;</button>
                </div>
                <ul>
                    {skills.map((skill, index) => (
                        <li key={index}>
                            {skill.name} - {skill.difficulty}
                            <button onClick={() => handleAddedSkill(skill.id)}>Add</button>
                        </li>
                    ))}
                </ul>
            </div>
            <h3>Current Routine</h3>
            <ul>
                {routine.map((skill, index) => (
                    <li key={index}>
                        {skill.name}
                        <button onClick={() => connectSkill(index)}>Connection</button>
                        <button onClick={() => removeSkill(index)}>Remove</button>
                    </li>
                ))}
            </ul>

            <h4>Difficulty:</h4>
            {Object.entries(calculateDifficulty(routine)).map(([key, value]) => (
                <p key={key}>
                    {key.toUpperCase()}: {value}
                </p>
            ))}
        </div>
    );
};

export default RoutineBuilder;