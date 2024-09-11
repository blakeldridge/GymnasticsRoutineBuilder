import React, { useState } from 'react';

const apparatusOptions = [
    'Floor',
    'Pommel Horse',
    'Still Rings',
    'Vault',
    'Parallel Bars',
    'Horizontal Bar'
];


const AddSkillForm = () => {
    const [name, setName] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [apparatus, setApparatus] = useState('');
    const [group, setGroup] = useState('');
    const [isPenaltyRequirement, setIsPenaltyRequirement] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const skill = { name, difficulty, apparatus, group, isPenaltyRequirement };
    
        try {
            const response = await fetch('/api/skills', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(skill)
            });
    
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Backend Error:', errorResponse);
                throw new Error('Failed to add skill');
            }
    
            const result = await response.json();
            console.log('Skill added successfully:', result);

            // Optionally clear the form
            setName('');
            setDifficulty('');
            setApparatus('');
            setGroup('')
            setIsPenaltyRequirement(false);
    
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Skill Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Difficulty:</label>
                <input type="number" step="0.1" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required />
            </div>
            <div>
                <label>Apparatus:</label>
                <select value={apparatus} onChange={(e) => setApparatus(e.target.value)}>
                    <option value="">Select an apparatus</option>
                    {apparatusOptions.map((app, index) => (
                        <option key={index} value={app}>
                            {app}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Group:</label>
                <select value={group} onChange={(e) => setGroup(e.target.value, 10)}>
                    <option value="">Select a group</option>
                    {[1, 2, 3, 4, 5].map((number) => (
                        <option key={number} value={number}>
                            {number}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Penalty:</label>
                <input type="checkbox" checked={isPenaltyRequirement} onChange={(e) => setIsPenaltyRequirement(e.target.checked)} />
            </div>
            <button type="submit">Add Skill</button>
        </form>
    );
};

export default AddSkillForm;