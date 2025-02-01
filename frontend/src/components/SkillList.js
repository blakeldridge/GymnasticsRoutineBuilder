import { Droppable } from 'react-beautiful-dnd';
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import DraggableSkill from './DraggableSkill';
import FilterForm from './SkillFilterForm';
import FlopForm from './FlopForm';

import '../css/routineBuilder.css';


const SkillList = forwardRef(({ apparatus, skillInRoutine, handleAddedSkill, exit }, ref) => {
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
    const [isFlopFormOpen, setIsFlopFormOpen] = useState(false);
    const [sortType, setSortType] = useState(0);

    const filterFormRef = useRef(null);

    useEffect(() => {
        const fetchSkills = async () => {
            // Fetch skills
            const skillsResponse = await fetch(`/api/skills/by-apparatus/${apparatus}`);
            const skillsData = await skillsResponse.json();
            const sortedSkills = skillsData.sort((skill1, skill2) => skill1.difficulty - skill2.difficulty);
            setSkills(sortedSkills);
            setFilteredSkills(sortedSkills)
        };

        fetchSkills();
    }, [apparatus]);

    useImperativeHandle(ref, () => ({
        getSkills: () => filteredSkills,
    }));

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

        // sortSkills();
    };

    const handleSkillSearch = (event) => {
        setSearchText(event.target.value);
        if (event.target.value === ""){
            setFilteredSkills(skills);
        }
        filterFormRef.current.changeSearchTerm(event.target.value);
    };

    const sortSkills = async (event) => {
        let sortedSkills = null;
        setSortType(event.target.value);
        const skillsToSort = [...filteredSkills];

        if (event.target.value === '0'){
            sortedSkills = skillsToSort.sort((skill1, skill2) => skill1.difficulty - skill2.difficulty);
        } else if (event.target.value === '1') {
            sortedSkills = skillsToSort.sort((skill1, skill2) => skill2.difficulty - skill1.difficulty);
        } else if (event.target.value === '2'){
            sortedSkills = skillsToSort.sort((skill1, skill2) => skill1.name.localeCompare(skill2.name));
        }else {
            sortedSkills = skillsToSort.sort((skill1, skill2) => skill2.name.localeCompare(skill1.name));
        }

        setFilteredSkills(sortedSkills);
    };

    return (
        <div className="skills hide-scrollbar">
            <Droppable droppableId="skills">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="skills-group"
                    >
                        <div className="skill-search-bar-container">
                            <input className="skill-search-bar" type="text" id="search" name="search" placeholder="Search Skills..." value={searchText} onChange={handleSkillSearch} />
                            {apparatus === "Pommel Horse" ? (
                                <button onClick={handleOpenFlopForm} className="flop-button">Add Flop Sequence</button>
                            ) : null}
                        </div>
                        <div className="skill-page-filter">
                            <div className="sorting-bar">
                                <p className="sort-text">Sort By : </p>
                                <select value={sortType} onChange={sortSkills} className="sort-skill-select">
                                    <option value="0">Difficulty: low to high</option>
                                    <option value="1">Difficulty: high to low</option>
                                    <option value="2">Alphabetical: a-z</option>
                                    <option value="3">Alphabetical: z-a</option>
                                </select>
                            </div>
                            <div className="right-side">
                                <div className="filter-button" onClick={() => setIsFilterFormOpen(!isFilterFormOpen)}>
                                    <p>Filters</p>
                                    {isFilterFormOpen ? (
                                        <FaChevronUp />
                                    ) : (
                                        <FaChevronDown /> 
                                    )}  
                                </div>                                 
                            </div>
                        </div>

                        <div className={`filter-form-container ${isFilterFormOpen ? 'open' : 'closed'}`}>
                            <FilterForm ref={filterFormRef} apparatus={apparatus} onFiltered={handleSkillFilter} onFiltersReset={() => setSearchText("")} />
                        </div>

                        <FlopForm isOpen={isFlopFormOpen} onCancel={handleCloseFlopForm} onAddedSkill={handleFlopAdded}/>

                        <div className="skills-box">
                            {filteredSkills.length === 0 ? (
                                <div class="empty-state" style={{"background-color":"var(--hover-color)","padding":"35% 10%", "margin":"0 3%", "border-radius":"12px"}}>
                                    <p style={{"color":"var(--primary-text-color)"}}>No skills Match Your Search</p>
                                </div>
                            ) : (
                                <div>
                                    {filteredSkills.map((skill, index) => (
                                        <div onClick={() => handleAddedSkill(skill)}>
                                            <DraggableSkill
                                                skill={skill}
                                                index={index}
                                                key={skill.name}
                                                disabled={skillInRoutine(skill)}
                                            />
                                        </div>
                                    ))}
                                    
                                </div>
                            )}
                        </div>
                        <FaTimes className="exit-skill-list-button" onClick={exit} />
                    </div>
                )}
            </Droppable>
        </div>
    );
});

export default SkillList;