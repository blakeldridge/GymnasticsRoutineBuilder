import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SaveRoutineForm.css';

// Make sure to import your icon if you have custom SVG icons
import { FaCheck, FaTimes } from 'react-icons/fa'; // Example using react-icons

const SaveRoutineForm = ({ userId, routineId, isOpen, onClose, onSubmit }) => {
    const [collectionName, setCollectionName] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [collections, setCollections] = useState([]);
    const [newCollectionId, setNewCollectionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionResponse = await fetch(`/api/user/${userId}/collections`);
                const collectionData = await collectionResponse.json();
                setCollections(collectionData);

                if (routineId) {
                    const routineResponse = await fetch(`/api/routines/${routineId}`);
                    const routineData = await routineResponse.json();
                    setInputValue(routineData.name);
                    const matchingCollection = collectionData.find(collection => collection.id === routineData.collectionId);
                    setSelectedValue(matchingCollection ? matchingCollection.name : "");
                }
            } catch (error) {
                console.error("Error fetching collections : ", error);
            }
        }

        fetchData();
    }, [userId, newCollectionId, routineId]);

    const confirmNewCollection = () => {
        fetch(`/api/user/${userId}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: collectionName })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setNewCollectionId(data.id); // Assuming the API returns the new collection's ID
            setSelectedValue(collectionName); // Set the new collection as the selected value
            setCollectionName("");
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleCancel = () => {
        setCollectionName("");
        setSelectedValue("");
        onClose();
    };

    const handleSelectChange = (event) => {
        setSelectedValue(event.target.value);
    }; 

    const handleSubmit = (event) => {
        event.preventDefault();
        let collectionId = null;
        if (selectedValue) {
            const selectedCollection = collections.find(collection => collection.name === selectedValue);
            collectionId = selectedCollection ? selectedCollection.id : null;
        }
        onSubmit(inputValue, collectionId); // Pass both routine name and collection ID
        setInputValue('');
        setSelectedValue('');
        onClose();
    };

    async function handleDelete() {
        try {
            const response = await fetch(`/api/routines/delete/${routineId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.text(); // Get success message from the server
                console.log(result);  // "Routine with ID [routineId] deleted"
                navigate('/profile');
            } else {
                const errorMessage = await response.text();
                console.error(`Error: ${errorMessage}`);
                // Optionally show the error message to the user in the UI
            }
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="save-overlay">
            <div className="save-content">
                <h2>Save Routine</h2>
                {routineId && (
                    <button onClick={handleDelete}>Delete</button>
                )}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter Routine Name"
                        required
                    />
                    {selectedValue === "Add New" ? (
                        <div className="new-collection-container">
                            <input 
                                className="new-collection-input" 
                                value={collectionName} 
                                placeholder="Enter Collection Name..." 
                                onChange={(event) => setCollectionName(event.target.value)} 
                            />
                            <span className="icon-button confirm-button" onClick={confirmNewCollection}>
                                <FaCheck 
                                    className="confirm-cancel-icons"
                                />
                            </span>
                            <span className="icon-button cancel-button" onClick={() => { setSelectedValue(""); setCollectionName("") }}>
                                <FaTimes
                                    className="confirm-cancel-icons"
                                />
                            </span>
                        </div>
                    ) : (
                        <select value={selectedValue} onChange={handleSelectChange}>
                            <option
                                value=""
                            >
                                No Collection
                            </option>
                            {collections.map((collection) => (
                                <option
                                    key={collection.id} 
                                    value={collection.name}
                                >
                                    {collection.name}
                                </option>
                            ))}

                            <option 
                                value="Add New"
                            >
                                + Add New Collection
                            </option>
                        </select>
                    )}
                    {routineId ? (
                        <button type="submit" disabled={selectedValue === "Add New"}>Save</button>
                    ) : (
                        <button type="submit" disabled={selectedValue === "Add New"}>Submit</button>
                    )}
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default SaveRoutineForm;