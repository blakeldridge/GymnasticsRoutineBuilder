import React, { useState,useEffect } from 'react';
import { calculateDifficulty } from "../utils/calculateDifficulty";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import DraggableSkill from './DraggableSkill';
import Placeholder from './RoutinePlaceholder';
import SaveRoutineForm from './SaveRoutineForm';
import '../css/routineBuilder.css';

const RoutineBuilder = ({ apparatus }) => {
    const { id } = useParams();
    const [skills, setSkills] = useState([]);
    const [group, setGroup] = useState(1);
    const [routineSlots, setRoutineSlots] = useState(getRoutineSlots());
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        getSkillInGroup(1);
        if (id) {
            fetch(`/api/routines/${id}`)
                .then(response => response.json())
                .then(data => {
                    setRoutineSlots(JSON.parse(data.skills));
                })
                .catch(error => console.error('Error fetching routines:', error));
        }
    }, [apparatus]);

    const getSkillInGroup = (group) => {
        fetch(`/api/skills/by-apparatus/${apparatus}/by-group/${group}`)
            .then(response => response.json())
            .then(data => setSkills(data))
            .catch(error => console.error('Error fetching skills:', error));
    };

    const handleOpenForm = () => setIsFormOpen(true);
    const handleCloseForm = () => setIsFormOpen(false);
    const handleSubmit = (inputValue) => {
        saveRoutine(inputValue);
    };

    function getRoutineSlots() {
        switch (apparatus) {
            case 'Vault':
                return Array(2).fill(null);
            default:
                return Array(8).fill(null);
        }
    }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        // Dragging from skills list to a routine slot
        if (source.droppableId === 'skills' && destination.droppableId.startsWith('routine-slot-')) {
            const slotIndex = parseInt(destination.droppableId.split('-')[2], 10);
            const updatedRoutineSlots = [...routineSlots];
            if (!updatedRoutineSlots[slotIndex]) {
                updatedRoutineSlots[slotIndex] = skills[source.index];
                setRoutineSlots(updatedRoutineSlots);

                const updatedSkills = [...skills];
                updatedSkills.splice(source.index, 1);
                setSkills(updatedSkills);
            }
        }

        // Moving a skill between routine slots
        if (source.droppableId.startsWith('routine-slot-') && destination.droppableId.startsWith('routine-slot-')) {
            const sourceIndex = parseInt(source.droppableId.split('-')[2], 10);
            const destinationIndex = parseInt(destination.droppableId.split('-')[2], 10);

            const updatedRoutineSlots = [...routineSlots];
            const [movedSkill] = updatedRoutineSlots.splice(sourceIndex, 1);
            updatedRoutineSlots.splice(destinationIndex, 0, movedSkill);
            setRoutineSlots(updatedRoutineSlots);
        }
    };

    const removeSkillFromSlot = (index) => {
        const updatedRoutineSlots = [...routineSlots];
        const removedSkill = updatedRoutineSlots[index];
        updatedRoutineSlots[index] = null;
        setRoutineSlots(updatedRoutineSlots);
        getSkillInGroup(group);
    };

    const connectSkills = (index) => {
        const updatedRoutineSlots = [...routineSlots];
        const isAlreadyConnected = updatedRoutineSlots[index]?.connection;
    
        if (isAlreadyConnected) {
            updatedRoutineSlots[index].connection = false;
            updatedRoutineSlots[index].connectionColor = null;
        } else {
            const color = generateUniqueColor();
            updatedRoutineSlots[index].connection = true;
            updatedRoutineSlots[index].connectionColor = color;
        }
    
        setRoutineSlots(updatedRoutineSlots);
    };
    
    const generateUniqueColor = () => {
        const colors = ['red', 'green', 'blue', 'purple', 'orange', 'yellow'];
        const usedColors = routineSlots.map(slot => slot?.connectionColor).filter(color => color);
        const availableColors = colors.filter(color => !usedColors.includes(color));
    
        return availableColors.length > 0 ? availableColors[0] : colors[Math.floor(Math.random() * colors.length)];
    };

    const handleGroupFilter = (event) => {
        setGroup(event.target.selectedIndex + 1);
        getSkillInGroup(event.target.selectedIndex + 1);
    };

    const handleSkillSearch = (event) => {
        if (event.target.value != ""){
            setSkills(skills.filter(skill => skill.name.toLowerCase().includes(event.target.value.toLowerCase())));
        } else {
            getSkillInGroup(group);
        }
    };

    const saveRoutine = async (name) => {
        const token = localStorage.getItem('userId'); // Assume the JWT token is stored as 'token'
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        
        const routineData = {
            name: name,
            apparatus: apparatus,
            routine: JSON.stringify(routineSlots),
            difficulty: calculateDifficulty(routineSlots),
            userId: userId
        };
    
        try {
            const response = await fetch('/api/routines/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the JWT token in the header
                },
                body: JSON.stringify(routineData),
            });
    
            if (response.ok) {
                alert('Routine saved successfully!');
            } else {
                alert('Failed to save routine.');
            }
        } catch (error) {
            console.error('Error saving routine:', error);
            alert('Error saving routine. Please try again.');
        }
    };
    
    return (
        <div className="routine-builder">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="skills">
                    <Droppable droppableId="skills">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="skills-group"
                            >
                                <div className="skill-page-filter">
                                    <input type="text" id="search" name="search" placeholder="Search Skills..." onChange={(handleSkillSearch)} />

                                    <select id="options" name="options" onChange={handleGroupFilter}>
                                        <option value="option1">Group I</option>
                                        <option value="option2">Group II</option>
                                        <option value="option3">Group III</option>
                                        <option value="option4">Group IV</option>
                                        {apparatus === "Vault" && (<option value="option5">Group V</option>)}
                                    </select>
                                </div>
                                <div className="skills-box">
                                    {skills.map((skill, index) => (
                                        <DraggableSkill skill={skill} index={index} key={skill.name} />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className="routine">
                    <h2 className="routine-title">Routine</h2>
                    <button onClick={handleOpenForm}>Save Routine</button>
                    <SaveRoutineForm
                        isOpen={isFormOpen}
                        onClose={handleCloseForm}
                        onSubmit={handleSubmit}
                    />
                    <div className="difficulty-block">
                        {Object.entries(calculateDifficulty(routineSlots) || {}).map(([key, value], index) => {
                            if (key === "Start Value") {
                                return (
                                    <div className="start-value-section" key={key}>
                                        <p className="start-value">{parseFloat(value).toFixed(2)}</p>
                                        <p className="start-value-label">SV</p>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className={`difficulty-section`} key={key}>
                                        <div className="difficulty-name-box">
                                            <p className="difficulty-key">{key}</p>
                                            <div class="difficulty-info-container">
                                                <button class="difficulty-info-button">i</button>
                                                <div class="difficulty-info-tooltip" dangerouslySetInnerHTML={{ __html: value.message }}>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="difficulty-value-box">
                                            <p className="difficulty-value">{parseFloat(value.value).toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>

                    <div className="skill-drop-container">
                        {routineSlots.map((slot, index) => (
                            <div className="skill-drop">
                                <p className="skill-drop-index">{index + 1}</p>
                                <div className="skill-drop-placeholder">
                                    <Placeholder
                                        apparatus={apparatus}
                                        routine={routineSlots}
                                        skill={slot}
                                        index={index}
                                        key={index.toString()}
                                        onRemove={removeSkillFromSlot}
                                        onConnect={connectSkills}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
};

export default RoutineBuilder;