import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../css/SkillFilterForm.css';

const FilterForm = forwardRef(({ apparatus, onFiltered, onFiltersReset }, ref) => {
    const [skillValues, setSkillValues] = useState([]); // Store selected difficulty values
    const [group, setGroup] = useState(0); // Store selected group
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTrigger, setFilterTrigger] = useState(true); // Trigger refiltering

    useEffect(() => {
        // Trigger the callback to send current filters to parent whenever they change
        onFiltered(group, skillValues, searchTerm);
    }, [group, skillValues, searchTerm, filterTrigger]);

    useImperativeHandle(ref, () => ({
        changeGroup,
        changeSearchTerm,
        reFilter,
    }));

    const changeGroup = (group) => {
        setGroup(group); // Update the group filter
    };

    const changeSearchTerm = (searchTerm) => {
        setSearchTerm(searchTerm);
    };

    const reFilter = () => {
        setFilterTrigger(!filterTrigger); // Trigger refiltering
    };

    // Reset function to clear the filters
    const resetFilters = () => {
        setGroup(0); // Reset group to "All Groups"
        setSkillValues([]); // Clear selected difficulties
        onFiltersReset();
    };

    const handleValueSelected = (difficulty) => {
        if (skillValues.includes(difficulty)) {
            setSkillValues(prevItems => prevItems.filter(item => item !== difficulty));
        } else {
            setSkillValues(prevItems => [...prevItems, difficulty]);
        }
    };

    return (
        <div className="filter-form">
            {/* Reset button at the top left */}
            <div className="reset-button-container">
                <button onClick={resetFilters} className="reset-button">
                    Reset Filters
                </button>
            </div>

            {/* Difficulty buttons */}
            <div className="difficulty-container">
                {Array.from({ length: 10 }, (_, index) => {
                    const difficulty = String.fromCharCode(65 + index);
                    const floatDifficulty = (index + 1) / 10;
                    const isSelected = skillValues.includes(floatDifficulty);
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleValueSelected(floatDifficulty)}
                            style={{
                                backgroundColor: isSelected ? 'var(--primary-highlight-color)' : 'var(--disabled-border-color)',
                                color: 'var(--primary-text-color)',
                                padding: '10px',
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            {difficulty}
                        </button>
                    );
                })}
            </div>

            {/* Group selector */}
            <select value={group} onChange={(event) => setGroup(parseInt(event.target.value))} className="group-selector">
                <option value="0">All Groups</option>
                <option value="1">Group I</option>
                <option value="2">Group II</option>
                <option value="3">Group III</option>
                <option value="4">Group IV</option>
                {apparatus === "Vault" && (
                    <option value="5">Group V</option>
                )}
            </select>
        </div>
    );
});

export default FilterForm;
