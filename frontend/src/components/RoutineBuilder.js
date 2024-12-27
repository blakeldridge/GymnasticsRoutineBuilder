import React, { useState, useEffect, useRef } from 'react';
import { calculateDifficulty } from "../utils/calculateDifficulty";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import DraggableSkill from './DraggableSkill';
import Placeholder from './RoutinePlaceholder';
import FlopForm from './FlopForm';
import FilterForm from './SkillFilterForm';
import '../css/routineBuilder.css';

const RoutineBuilder = ({ apparatus }) => {
    const { id } = useParams();
    const token = localStorage.getItem('userId');
    const userId = token ? jwtDecode(token).id : null;
    const filterFormRef = useRef(null);
    const [routineName, setRoutineName] = useState("Routine");
    const [routineNameValue, setRoutineNameValue] = useState("");
    const [editRoutineName, setEditRoutineName] = useState(false);
    const [routineCollection, setRoutineCollection] = useState("");
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [routineSlots, setRoutineSlots] = useState(getRoutineSlots());
    const [isFlopFormOpen, setIsFlopFormOpen] = useState(false);
    const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
    const [routineSavedTrigger, setRoutineSavedTrigger] = useState(true);
    const [collections, setCollections] = useState([]);
    const [collectionFormValue, setCollectionFormValue] = useState("");
    const [changesSaved, setChangesSaved] = useState(false);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch skills
                const skillsResponse = await fetch(`/api/skills/by-apparatus/${apparatus}`);
                const skillsData = await skillsResponse.json();
                const sortedSkills = skillsData.sort((skill1, skill2) => skill1.difficulty - skill2.difficulty);
                setSkills(sortedSkills);
                setFilteredSkills(sortedSkills)
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

    const handleOpenFlopForm = () => setIsFlopFormOpen(true); // Open Flop form modal
    const handleCloseFlopForm = () => setIsFlopFormOpen(false); // Close Flop form modal

    const handleFlopAdded = (flopSequence, value) => {
        const flop = {
            "id": skills.reduce((max, skill) => (skill.id > max ? skill.id : max), 0) + 1,
            "name":flopSequence,
            "difficulty":(value.charCodeAt(0) - 64) / 10,
            "apparatus":"Pommel Horse",
            "group":2,
            "isPenaltyRequirement":false,
            "isFlop":true
        }
        setSkills(prevSkills => [flop, ...prevSkills]);
        filterFormRef.current.changeGroup(2);
        setIsFlopFormOpen(false);
    };

    const handleAddedSkill = (skill) => {
        // Create a copy of the current routine slots
        const updatedSlots = [...routineSlots];

        // Find the index of the first null value
        const firstNullIndex = updatedSlots.findIndex(slot => slot === null);

        // If a null slot is found, replace it with the new value
        if (firstNullIndex !== -1) {
            updatedSlots[firstNullIndex] = skill;
            // Update the state with the new list
            setRoutineSlots(updatedSlots);
            setChangesSaved(false)
        } else {
            console.log('No available slot to place the skill.');
        }
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
    
        if (!destination) return; // if dropped outside of any valid target, do nothing
    
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
            console.log("moving skill already in routine");
            const sourceIndex = parseInt(source.droppableId.split('-')[2], 10);
            const destinationIndex = parseInt(destination.droppableId.split('-')[2], 10);
    
            const movedSkill = updatedRoutineSlots[sourceIndex];
    
            // If destination slot is empty, move skill directly
            if (!updatedRoutineSlots[destinationIndex]) {
                console.log("slot was empty, easy");
                updatedRoutineSlots[destinationIndex] = movedSkill;
                updatedRoutineSlots[sourceIndex] = null;
            } else {
                // If destination is occupied, check if there's space to push skills
                console.log("oooo slot was not empty, what will happen next...");
                const isSpace = updatedRoutineSlots.some(item => item === null);
                if (isSpace) {
                    console.log("push that shit");
                    // Push the skills right, starting from the destination
                    pushSkillsRight(destinationIndex);
                    updatedRoutineSlots[destinationIndex] = movedSkill;
                    updatedRoutineSlots[sourceIndex] = null;
                } else {
                    console.log("ah shit it failed unlcuky");
                    // No space, send skill back to the original slot or list
                    updatedRoutineSlots[sourceIndex] = movedSkill;
                }
            }
    
            setRoutineSlots(updatedRoutineSlots);
            setChangesSaved(false);
        }
    
        // Moving skill from skill list to routine slot
        if (source.droppableId === 'skills' && destination.droppableId.startsWith('routine-slot-')) {
            console.log("skill being added");
            const slotIndex = parseInt(destination.droppableId.split('-')[2], 10);
            const movedSkill = filteredSkills[source.index];
    
            // If destination slot is empty, place the skill
            if (!updatedRoutineSlots[slotIndex]) {
                console.log("empty slot, easy");
                updatedRoutineSlots[slotIndex] = movedSkill;
            } else {
                console.log("not empty slot, shit just got real");
                // If destination slot is occupied, push skills if space exists
                const isSpace = updatedRoutineSlots.slice(slotIndex).some((slot) => !slot);
                if (isSpace) {
                    console.log("its getting movedddd");
                    pushSkillsRight(slotIndex);
                    updatedRoutineSlots[slotIndex] = movedSkill;
                } else {
                    console.log("what a waste of time");
                    // No space, don't place the skill (send it back to the list)
                    return;
                }
            }

            setRoutineSlots(updatedRoutineSlots);
            setChangesSaved(false);
        }

        
        // place skill back into list (another way to remove a skill)
        if (source.droppableId.startsWith('routine-slot-') && destination.droppableId === "skills") {
            const slotIndex = parseInt(source.droppableId.split('-')[2], 10);
            removeSkillFromSlot(slotIndex);
        }
    
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

    const handleSkillFilter = (group, difficulties, searchTerm) => {
        setFilteredSkills(() => {
            let skillsFilteredByGroup;
            if (group == 0) {
                skillsFilteredByGroup = skills;
            } else {
                // Filter by group first
                skillsFilteredByGroup = skills.filter(skill => skill.group == group);            
            }

            skillsFilteredByGroup = skillsFilteredByGroup.filter(skill => {
                // Split the search text into individual words, ignoring extra spaces
                const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
              
                // Check if every word is included in the skill's name
                return searchWords.every(word => skill.name.toLowerCase().includes(word));
            });
            // If difficulties are provided, further filter by difficulty
            if (difficulties.length > 0) {
                return skillsFilteredByGroup.filter(skill => difficulties.includes(skill.difficulty));
            }
            // Return skills filtered only by group if no difficulties are present
            return skillsFilteredByGroup;
        })
    };

    const handleSkillSearch = (event) => {
        setSearchText(event.target.value);
        filterFormRef.current.changeSearchTerm(event.target.value);
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
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="skills hide-scrollbar">
                    <Droppable droppableId="skills">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="skills-group"
                            >
                                <div className="skill-page-filter">
                                    <div className="left-side">
                                        <input type="text" id="search" name="search" placeholder="Search Skills..." value={searchText} onChange={handleSkillSearch} />
                                        {apparatus === "Pommel Horse" ? (
                                            <button onClick={handleOpenFlopForm} className="flop-button">Add Flop Sequence</button>
                                        ) : null}
                                    </div>
                                    <div className="right-side">
                                        <button
                                            onClick={() => setIsFilterFormOpen(!isFilterFormOpen)}
                                            className="filter-button"
                                        >
                                            Filters{' '}
                                            <span className={`arrow ${isFilterFormOpen ? 'up' : 'down'}`}>
                                                &#9660;
                                            </span>
                                        </button>                                    
                                    </div>
                                </div>

                                <div className={`filter-form-container ${isFilterFormOpen ? 'open' : 'closed'}`}>
                                    <FilterForm ref={filterFormRef} apparatus={apparatus} onFiltered={handleSkillFilter} onFiltersReset={() => setSearchText("")} />
                                </div>

                                <div className="skills-box">
                                    {filteredSkills.length === 0 ? (
                                        <div class="empty-state" style={{"background-color":"var(--hover-color)","padding":"35% 10%", "margin":"0 3%", "border-radius":"12px"}}>
                                            <p style={{"color":"var(--primary-text-color)"}}>No skills Match Your Search</p>
                                        </div>
                                    ) : (
                                        <>
                                            {filteredSkills.map((skill, index) => (
                                                <DraggableSkill
                                                    skill={skill}
                                                    index={index}
                                                    key={skill.name}
                                                    disabled={routineSlots.some(item => item && item.id === skill.id)}
                                                    onAddSkill={handleAddedSkill}
                                                />
                                            ))}
                                            {provided.placeholder}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </div>
                <div className="routine">
                        {token ? (
                            <>
                            <div className="routine-box">
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
                                            <FaPencilAlt className="edit-icon" onClick={() => { setEditRoutineName(true); }} />
                                        </div>
                                    )}
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
                                        <select value={collectionFormValue} onChange={(event) => { setCollectionFormValue(event.target.value); setChangesSaved(false); }}>
                                            <option value="">No Collection</option>
                                            {collections.map((collection) => (
                                                <option key={collection.id} value={collection.name}>{collection.name}</option>
                                            ))}
                                            <option value="Add New">+ Add New Collection</option>
                                        </select>
                                    )}
                                </div>
                                <button className={`save-routine-button ${changesSaved ? "button-saved" : null}`} disabled={changesSaved} onClick={saveRoutine}>{changesSaved ? "Saved!" : "Save"}</button>
                            </div>
                            </>
                        ) : null}
                    
                    <FlopForm isOpen={isFlopFormOpen} onCancel={handleCloseFlopForm} onAddedSkill={handleFlopAdded}/>

                    <div className="routine-section">
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
                                    if ((key === "Penalty" || key === "Bonus") && value.value === 0) {
                                        return;
                                    } else {
                                        return (
                                            <div className={"difficulty-section"} key={key}>
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
                                }
                            })}
                        </div>

                        <div className="skill-drop-container">
                            {routineSlots.map((slot, index) => (
                                <div className="skill-drop" key={index}>
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
                
                </div>
            </DragDropContext>
        </div>
    );
};

export default RoutineBuilder;