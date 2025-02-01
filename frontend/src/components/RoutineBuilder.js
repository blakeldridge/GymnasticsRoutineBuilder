import React, { useState, useEffect, useRef } from 'react';
import { calculateDifficulty } from "../utils/calculateDifficulty";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FaPencilAlt, FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Placeholder from './RoutinePlaceholder';
import DifficultyBreakdown from './DifficultyBreakdown';
import SkillList from './SkillList';

import getApparatusIcon from '../utils/apparatusIconGetter';

import '../css/routineBuilder.css';


const RoutineBuilder = ({ apparatus }) => {
    const { id } = useParams();
    const token = localStorage.getItem('userId');
    const userId = token ? jwtDecode(token).id : null;
    const [routineName, setRoutineName] = useState("Routine");
    const [routineNameValue, setRoutineNameValue] = useState("");
    const [editRoutineName, setEditRoutineName] = useState(false);
    const [routineCollection, setRoutineCollection] = useState("");
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [routineSlots, setRoutineSlots] = useState(getRoutineSlots());
    const [routineSavedTrigger, setRoutineSavedTrigger] = useState(true);
    const [collections, setCollections] = useState([]);
    const [collectionFormValue, setCollectionFormValue] = useState("");
    const [changesSaved, setChangesSaved] = useState(false);
    const [isSkillsOpen, setIsSkillsOpen] = useState(false);
    const [skillIndex, setSkillIndex] = useState(0);

    const skillsRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token){
                    // Fetch Collections
                    const collectionsResponse = await fetch(`/api/user/${userId}/collections`);
                    const collectionData = await collectionsResponse.json();
                    setCollections(collectionData);
                    
                    // Fetch routine slots if id is available
                    if (id) {
                        const routineResponse = await fetch(`/api/routines/${id}`);
                        const routineData = await routineResponse.json();
                        setRoutineSlots(JSON.parse(routineData.skills));
                        setRoutineName(routineData.name);
                        setRoutineNameValue(routineData.name);

                        if (routineData.collectionId){
                            const name = collectionData.find(collection => collection.id === routineData.collectionId).name;
                            setRoutineCollection(name);
                            setCollectionFormValue(name);
                        }
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [apparatus, id, routineSavedTrigger]);

    const confirmNewCollection = () => {
        fetch(`/api/user/${userId}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: routineCollection })
        })
        .then(response => response.json())
        .then(data => {
            collections.push({
                "id":data.id,
                "name":routineCollection,
                "userId":userId
            });
            setCollectionFormValue(routineCollection); // Set the new collection as the selected value
            setRoutineCollection("");
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleAddedSkill = (skill) => {
        // Create a copy of the current routine slots
        const updatedSlots = [...routineSlots];

        // Find the index of the first null value
        const firstNullIndex = updatedSlots.findIndex(slot => slot === null);

        // If a null slot is found, replace it with the new value
        if (firstNullIndex !== -1) {
            updatedSlots[skillIndex] = skill;
            // Update the state with the new list
            setRoutineSlots(updatedSlots);
            setChangesSaved(false)
        } else {
            console.log('No available slot to place the skill.');
        }

        exitSkillList();
    };

    const exitSkillList = () => setIsSkillsOpen(false);

    const enterSkillList = (index) => {
        setIsSkillsOpen(true);
        setSkillIndex(index);
    }

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
    
        if (!destination) {
            console.log("here");
            return; // if dropped outside of any valid target, do nothing
        }
    
        const updatedRoutineSlots = [...routineSlots];
    
        // Helper function to shift skills right starting from a given index
        const pushSkillsRight = (startIndex) => {
            for (let i = updatedRoutineSlots.length - 1; i > startIndex; i--) {
                if (!updatedRoutineSlots[i]) {
                    updatedRoutineSlots[i] = updatedRoutineSlots[i - 1];
                    updatedRoutineSlots[i - 1] = null;
                }
            }
        };
    
        // Moving skill between routine slots
        if (source.droppableId.startsWith('routine-slot-') && (destination.droppableId.startsWith('routine-slot-'))) {
            const sourceIndex = parseInt(source.droppableId.split('-')[2], 10);
            const destinationIndex = parseInt(destination.droppableId.split('-')[2], 10);
    
            const movedSkill = updatedRoutineSlots[sourceIndex];
    
            // If destination slot is empty, move skill directly
            if (!updatedRoutineSlots[destinationIndex]) {
                updatedRoutineSlots[destinationIndex] = movedSkill;
                updatedRoutineSlots[sourceIndex] = null;
            } else {
                // If destination is occupied, check if there's space to push skills
                const isSpace = updatedRoutineSlots.some(item => item === null);
                if (isSpace) {
                    // Push the skills right, starting from the destination
                    pushSkillsRight(destinationIndex);
                    updatedRoutineSlots[destinationIndex] = movedSkill;
                    updatedRoutineSlots[sourceIndex] = null;
                } else {
                    // No space, send skill back to the original slot or list
                    updatedRoutineSlots[sourceIndex] = movedSkill;
                }
            }
    
            //setRoutineSlots(updatedRoutineSlots);
            //setChangesSaved(false);
        }

        setRoutineSlots(updatedRoutineSlots);
        setChangesSaved(false);
    
        // Moving skill from skill list to routine slot
        /*
        if (source.droppableId === 'skills' && destination.droppableId.startsWith('routine-slot-')) {
            const slotIndex = parseInt(destination.droppableId.split('-')[2], 10);
            const movedSkill = skillsRef.current.getSkills()[source.index];
    
            // If destination slot is empty, place the skill
            if (!updatedRoutineSlots[slotIndex]) {
                updatedRoutineSlots[slotIndex] = movedSkill;
            } else {
                // If destination slot is occupied, push skills if space exists
                const isSpace = updatedRoutineSlots.slice(slotIndex).some((slot) => !slot);
                if (isSpace) {
                    pushSkillsRight(slotIndex);
                    updatedRoutineSlots[slotIndex] = movedSkill;
                } else {
                    // No space, don't place the skill (send it back to the list)
                    return;
                }
            }

            setRoutineSlots(updatedRoutineSlots);
            setChangesSaved(false);
        }
        */

        
        // place skill back into list (another way to remove a skill)
        /*
        if (source.droppableId.startsWith('routine-slot-') && destination.droppableId === "skills") {
            const slotIndex = parseInt(source.droppableId.split('-')[2], 10);
            removeSkillFromSlot(slotIndex);
        }
        */
    
    };
    
    const removeSkillFromSlot = (index) => {
        const updatedRoutineSlots = [...routineSlots];
        const removedSkill = updatedRoutineSlots[index];
        updatedRoutineSlots[index] = null;
        setRoutineSlots(updatedRoutineSlots);
        // filterFormRef.current.reFilter();
        setChangesSaved(false);
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
        setChangesSaved(false);
    };
    
    const generateUniqueColor = () => {
        const colors = ['red', 'green', 'blue', 'purple', 'orange', 'yellow'];
        const usedColors = routineSlots.map(slot => slot?.connectionColor).filter(color => color);
        const availableColors = colors.filter(color => !usedColors.includes(color));
    
        return availableColors.length > 0 ? availableColors[0] : colors[Math.floor(Math.random() * colors.length)];
    };

    const skillInRoutine = (skill) => {
        return routineSlots.some(item => item && item.id === skill.id);
    };

    const calculateRoutineDifficulty = () => {
        return calculateDifficulty(routineSlots);
    };

    const saveRoutine = async () => {        
        console.log(collectionFormValue);
        const routineData = {
            name: routineName,
            apparatus: apparatus,
            routine: JSON.stringify(routineSlots),
            difficulty: JSON.stringify(calculateDifficulty(routineSlots)),
            userId: userId,
            collectionId: collectionFormValue ? collections.find(collection => collection.name === collectionFormValue).id : null
        };

        if (id) {
            try {
                const response = await fetch(`/api/routines/save/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Send the JWT token in the header
                    },
                    body: JSON.stringify(routineData),
                });

                if (response.ok) {
                    // alert('Routine updated successfully!');
                    setChangesSaved(true);
                    //setRoutineSavedTrigger(!routineSavedTrigger);
                } else {
                    alert('Failed to save pre-existing routine.');
                }
            } catch (error) {
                console.error('Error saving pre-existing routine:', error);
                alert('Error saving per-exising routine. Please try again.');
            }
        } else {
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
                    // alert('Routine saved successfully!');
                    setChangesSaved(true);
                } else {
                    alert('Failed to save routine.');
                }
            } catch (error) {
                console.error('Error saving routine:', error);
                alert('Error saving routine. Please try again.');
            }
        }
    };
    
    return (
        <div className="routine-builder">
            <DragDropContext onDragStart={() => setIsSkillsOpen(false)} onDragEnd={onDragEnd}>
                <div className={`skills-panel ${isSkillsOpen ? 'visible' : 'hidden'}`}>
                    <SkillList apparatus={apparatus} skillInRoutine={skillInRoutine} handleAddedSkill={handleAddedSkill} exit={exitSkillList} ref={skillsRef}/>
                </div>
                <div className="routine">
                    <div className="routine-section">
                        <div className="routine-info-section">
                            {token ? (
                                <>
                                    <div className="routine-box">
                                        <div className="routine-builder-apparatus-icon">
                                            {getApparatusIcon(apparatus)}
                                        </div>
                                        <div className="routine-info-box">
                                            {editRoutineName ? (
                                                <div className='edit-text-container'>
                                                    <input className="edit-input" value={routineNameValue} onChange={(event) => setRoutineNameValue(event.target.value)} />
                                                    <button className="edit-submit-btn" onClick={() => {setRoutineName(routineNameValue); setEditRoutineName(false); setChangesSaved(false);}}>Submit</button>
                                                    <button className="edit-cancel-btn" onClick={() => {setEditRoutineName(false); setRoutineNameValue(routineName)}}>Cancel</button>
                                                </div>
                                            ) : (
                                                <div className="routine-title-container">
                                                    <h2 className="routine-title">{routineName}</h2>
                                                    {/*<FaPencilAlt className="edit-icon" onClick={() => { setEditRoutineName(true); }} />*/}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : null}
                            <div className="routine-info-right-section">
                                <DifficultyBreakdown calculate={calculateRoutineDifficulty} id={token}/>
                                <div className="save-info">
                                    <button className={`save-routine-button ${changesSaved ? "button-saved" : null}`} disabled={changesSaved} onClick={saveRoutine}>{changesSaved ? "Saved!" : "Save"}</button>
                                    {collectionFormValue === "Add New" ? (
                                        <div className="new-collection-container">
                                            <input 
                                                className="new-collection-input" 
                                                value={routineCollection} 
                                                placeholder="Enter Collection Name..." 
                                                onChange={(event) => {
                                                    setRoutineCollection(event.target.value);
                                                }} 
                                            />
                                            <span className="icon-button confirm-button" onClick={confirmNewCollection}>
                                                <FaCheck className="confirm-cancel-icons" />
                                            </span>
                                            <span className="icon-button cancel-button" onClick={() => { setCollectionFormValue(""); setRoutineCollection("") }}>
                                                <FaTimes className="confirm-cancel-icons" />
                                            </span>
                                        </div>
                                    ) : (
                                        <select className="collection-dropdown" value={collectionFormValue} onChange={(event) => { setCollectionFormValue(event.target.value); setChangesSaved(false); }}>
                                            <option value="">No Collection</option>
                                            {collections.map((collection) => (
                                                <option key={collection.id} value={collection.name}>{collection.name}</option>
                                            ))}
                                            <option value="Add New">+ Add New Collection</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="skill-drop-container">
                            {routineSlots.map((slot, index) => (
                                <div className="skill-drop" key={index}>
                                    <div className="skill-drop-placeholder">
                                        <Placeholder
                                            apparatus={apparatus}
                                            routine={routineSlots}
                                            skill={slot}
                                            index={index}
                                            key={index.toString()}
                                            onRemove={removeSkillFromSlot}
                                            onConnect={connectSkills}
                                            onClick={enterSkillList}
                                        />
                                    </div>
                                    {index !== 3 && index !== 7 ? (
                                        <FaArrowRight className="routine-direction-arrow" />
                                    ) : <FaArrowRight style={{"color" : "transparent"}} className="routine-direction-arrow" />}
                                </div>
                            ))}
                        </div>
                    </div>
                
                </div>
            </DragDropContext>
        </div>
    );
};

export default RoutineBuilder;