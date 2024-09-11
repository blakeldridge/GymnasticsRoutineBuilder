import React, { useState } from 'react';
import '../css/SaveRoutineForm.css'; // Assuming you will add CSS for styling

const SaveRoutineForm = ({ isOpen, onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(inputValue);
        setInputValue('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="save-overlay">
            <div className="save-content">
                <h2>Save Routine</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter Routine Name"
                        required
                    />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default SaveRoutineForm;
