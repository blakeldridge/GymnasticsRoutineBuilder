import React, { useState, useEffect } from 'react';

const SkillList = () => {
    const [skills, setSkills] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');  // State for search input

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await fetch('/api/skills');
            const data = await response.json();
            setSkills(data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    // Filter skills based on the search term
    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteSkill = async (id) => {
        try {
            const response = await fetch(`/api/skills/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                setSkills(skills.filter(skill => skill.id !== id));  // Update the state
            } else {
                console.error('Failed to delete skill');
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    return (
        <div>
            <h2>Skills</h2>
            <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // Update search term
            />
            <ul>
                {filteredSkills.map(skill => (
                    <li key={skill.id}>
                        {skill.name} Difficulty: {skill.difficulty} Apparatus: {skill.apparatus}
                        <button onClick={() => deleteSkill(skill.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SkillList;
