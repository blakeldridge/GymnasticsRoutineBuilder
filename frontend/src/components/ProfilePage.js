import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaArrowLeft, FaTrash, FaPlus, FaStar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import ProfilePicture from './ProfilePicture';
import RoutineTab from './RoutineTab';
import '../css/ProfilePage.css';
import CollectionTab from './CollectionTab';

const ProfilePage = () => {
    const token = localStorage.getItem('userId');
    const userId = token ? jwtDecode(token).id : null;
    const [allRoutines, setAllRoutines] = useState([]);
    const [activeRoutines, setActiveRoutines] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState(null);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [collectionAddedTrigger, setCollectionAddedTrigger] = useState(false);
    const [collectionSort, setCollectionSort] = useState(0);
    const [routineSort, setRoutineSort] = useState(0);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState('collection');
    const [editName, setEditName] = useState(false);
    const [editNameValue, setEditNameValue] = useState('');
    const [editCollectionName, setEditCollectionName] = useState(false);
    const [editCollectionNameValue, setEditCollectionNameValue] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (token && userId) {
            setUserData();
            setRoutineData();
            setCollectionData();
        } else {
            navigate('/log-in');
        }
    }, [token, userId]);

    useEffect(() => {
        setCollectionData();
    }, [collectionAddedTrigger]);

    useEffect(() => {
        //setRoutineData();
    }, [allRoutines, activeRoutines])

    const setUserData = () => {
        fetch(`/api/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setUsername(data.name);
            if (data.profile_pic) {
                setProfileImage(`http://localhost:5000${data.profile_pic}`);
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
    };

    const setRoutineData = () => {
        fetch(`/api/user/routines/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setAllRoutines(data);
            setActiveRoutines(data.filter(routine => routine.isActive === true));
        })
        .catch(error => console.error('Error fetching routines:', error));
    };

    const setCollectionData = () => {
        fetch(`/api/user/${userId}/collections`)
            .then(response => response.json())
            .then(data => {
                setCollections(data);
            })
        .catch(error => console.error('Error fetching collections: ', error));
    };

    const calculateTotalStartValue = (routines) => {
        let total = routines.reduce((total, routine) => {
            return total + JSON.parse(routine.difficulty)["Start Value"];
        }, 0);
        return total.toFixed(2);
    };

    const handleTabClick = (tab) => {
        setSelectedCollectionId(null);
        setActiveTab(tab);
    };

    const handleUpdatePfp = (file) => {
        const formData = new FormData();
        formData.append('profilePicture', file);
    
        // Corrected API endpoint
        fetch(`/api/user/${userId}/update-details/pfp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Send the JWT token in the header
            },
            body: formData, // Use FormData directly
        })
            .then(response => response.json())
            .then(data => {
                console.log('Profile picture updated:', data);
                // Update UI or state with the new profile picture URL if necessary
            })
            .catch(error => {
                console.error('Error updating profile picture:', error);
            });
    };    

    const handleNameChange = async () => {
        try {
            const response = await fetch(`/api/user/${userId}/update-details/username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Send the JWT token in the header
                },
                body: JSON.stringify({ username: editNameValue }), // Correct JSON payload
            });
    
            if (response.ok) {
                setUsername(editNameValue); // Update UI with new username
                setEditName(false); // Hide the edit input
                // alert('User updated successfully!');
            } else {
                const errorData = await response.json(); // Capture any error messages
                alert(`Failed to update user: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating username:', error);
            alert('Error updating username. Please try again.');
        }
    };    

    const handleSetActiveRoutine = async (routine, status) => {
        try {
            const response = await fetch(`/api/routines/favourite/${routine.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: status })
            });

            if (response.ok) {
                await setRoutineData();
                //alert("Routine Updated successfully");
            } else {
                const errorText = await response.text();
                alert(`Failed to update routine: ${errorText}`);
            }
        } catch (error) {
            console.error('Error updating routine:', error);
            alert('Error updating routine. Please try again.');
        }
    };

    async function handleDeleteRoutine(routineId) {
        try {
            const response = await fetch(`/api/routines/delete/${routineId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.text(); // Get success message from the server
                const updatedRoutines = [...allRoutines];
                const index = allRoutines.find(routine => routine.id === routineId)
                const removedSkill = updatedRoutines[index];
                updatedRoutines[index] = null;
                setAllRoutines(updatedRoutines);
            } else {
                const errorMessage = await response.text();
                console.error(`Error: ${errorMessage}`);
                // Optionally show the error message to the user in the UI
            }
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    };

    const handleCollectionSelected = (id) => {
        setSelectedCollectionId(id);
    };

    const handleCollectionAdded = () => {
        fetch(`/api/user/${userId}/collections`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newCollectionName,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setNewCollectionName("");
            setCollectionAddedTrigger(!collectionAddedTrigger);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const handleCollectionNameUpdated = () => {
        fetch(`/api/user/${userId}/collections/${selectedCollectionId}/update-details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: editCollectionNameValue,
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Update Successful: ", data);
            setCollectionAddedTrigger(!collectionAddedTrigger);
            setEditCollectionName(false);
            setEditCollectionNameValue('');
        })
        .catch(error => {
            console.error('Error: ', error);
        });
    }

    async function deleteCollection() {
        try {
            const response = await fetch(`/api/user/${userId}/collections/${selectedCollectionId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.text(); // Get success message from the server
                console.log(result);  // "Routine with ID [routineId] deleted"
                setSelectedCollectionId(null);
                setCollectionAddedTrigger(!collectionAddedTrigger);
            } else {
                const errorMessage = await response.text();
                console.error(`Error: ${errorMessage}`);
                // Optionally show the error message to the user in the UI
            }
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    }

    const getCollectionRoutines = (id) => {
        const routines = allRoutines.filter(routine => routine.collectionId === (id ? id : selectedCollectionId));
        return routines;
    };

    const getRoutineSet = (routines) => {
        const pieces = [
            "Floor",
            "Pommel Horse",
            "Rings",
            "Vault",
            "Parallel Bars",
            "High Bar"
        ];

        return pieces.map(piece => {
            let routine = routines.find(routine => routine.apparatus === piece);
            return routine || {
                name: "Not Built",
                apparatus: piece,
                skills: [],
                difficulty: JSON.stringify({"Start Value": 0.0, "Execution": {"value":0.0, "message":null}, "Difficulty":{"value":0.0, "message":null}}),
                isActive: false,
                userId: -1
            };
        });
    };

    const sortRoutineList = (event) => {
        let updatedRoutines = [];

        setRoutineSort(event.target.value);

        const routines = [...allRoutines];

        if (event.target.value === '0'){
            updatedRoutines = routines.sort((routine1, routine2) => JSON.parse(routine1.difficulty)["Start Value"] - JSON.parse(routine2.difficulty)["Start Value"]);
        } else if (event.target.value === '1'){
            updatedRoutines = routines.sort((routine1, routine2) => JSON.parse(routine2.difficulty)["Start Value"] - JSON.parse(routine1.difficulty)["Start Value"]);
        } else if (event.target.value === '2'){
            updatedRoutines = routines.sort((routine1, routine2) => routine1.name.localeCompare(routine2.name));
        } else {
            updatedRoutines = routines.sort((routine1, routine2) => routine2.name.localeCompare(routine1.name));
        }
        setAllRoutines(updatedRoutines);
    };

    const sortCollectionList = (event) => {
        let updatedCollections = [];

        setCollectionSort(event.target.value);

        const c = [...collections];

        if (event.target.value === '0') {
            updatedCollections = c.sort((collection1, collection2) => 
                allRoutines.reduce((total, routine) => total + (routine.collectionId === collection1.id ? JSON.parse(routine.difficulty)["Start Value"] : 0), 0) -
                allRoutines.reduce((total, routine) => total + (routine.collectionId === collection2.id ? JSON.parse(routine.difficulty)["Start Value"] : 0), 0)
            );
        } else if (event.target.value === '1') {
            updatedCollections = c.sort((collection1, collection2) => 
                allRoutines.reduce((total, routine) => total + (routine.collectionId === collection2.id ? JSON.parse(routine.difficulty)["Start Value"] : 0), 0) -
                allRoutines.reduce((total, routine) => total + (routine.collectionId === collection1.id ? JSON.parse(routine.difficulty)["Start Value"] : 0), 0)
            );
        } else if (event.target.value === '2') {
            updatedCollections = c.sort((routine1, routine2) => routine1.name.localeCompare(routine2.name));
        } else {
            updatedCollections = c.sort((routine1, routine2) => routine2.name.localeCompare(routine1.name))
        }

        setCollections(updatedCollections);
    };

    return (
        <div className="profile-container">
            <div className="profile-section">
                <ProfilePicture currentProfilePicture={profileImage} onUpdate={handleUpdatePfp}/>
                {editName ? (
                    <div className="edit-text-container">
                        <input className="edit-input" title="Edit Username." value={editNameValue} onChange={(event) => setEditNameValue(event.target.value)} />
                        <button className="edit-submit-btn" onClick={handleNameChange}>Submit</button>
                        <button className="edit-cancel-btn" onClick={() => setEditName(false)}>Cancel</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', margin:"7px 0", color: "white" }}>
                        <h2>{username}</h2>
                        <FaPencilAlt className="edit-icon" onClick={() => { setEditName(true); setEditNameValue(username); }} />
                    </div>
                )}
                <div className="stats-box">
                    <div className="stat-vertical">
                        <p className="stat-vertical-title">Routines Made : </p>
                        <p className="stat-vertical-value">{allRoutines.length}</p>
                    </div>
                    <div className="stat-vertical">
                        <p className="stat-vertical-title">Collections Made : </p>
                        <p className="stat-vertical-value">{collections.length}</p>
                    </div>
                </div>
                <div className="stats-box-2">
                    <div className="stat-horizontal">
                        <p className="stat-horizontal-title">Highest Start Value : </p>
                        <p className="stat-horizontal-value">{(0.00).toFixed(2)}</p>
                    </div>
                    <div className="stat-horizontal">
                        <p className="stat-horizontal-title">Highest Routine : </p>
                        <p className="stat-horizontal-value">{allRoutines.length === 0 ? 0 : allRoutines.reduce((max, routine) => {
                                const difficultyValue = JSON.parse(routine.difficulty)["Start Value"];
                                return difficultyValue > max ? difficultyValue : max;
                            }, 0).toFixed(2)}</p>
                    </div>
                </div>

                <div className="profile-options-container">
                    <div className="profile-option">
                        <FaStar />
                        <p>Premium</p>
                    </div>
                    <div className="profile-option">
                        <FaCog />
                        <p>Settings</p>
                    </div>
                    <div className="profile-option">
                        <FaSignOutAlt />
                        <p>Log Out</p>
                    </div>
                </div>

            </div>
            <div className="routines-section">
                <div className="tab-container">
                    <div
                        className={`tab ${activeTab === 'collection' ? 'active' : ''}`}
                        onClick={() => handleTabClick('collection')}
                    >
                        Collections
                    </div>
                    <div
                        className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabClick('all')}
                    >
                        All Routines
                    </div>
                </div>
                {activeTab === 'active' && (
                    <div className={`routine-tab ${activeTab === 'active' ? 'active' : ''}`}>
                        {getRoutineSet(activeRoutines).map(routine => (
                            <RoutineTab key={routine.id} routine={routine} activeRoutine={true} setActive={status => handleSetActiveRoutine(routine, status)} onDelete={handleDeleteRoutine} />
                        ))}
                    </div>
                )}
                {activeTab === 'all' && (
                    <div className="routine-tab-container">
                        <div className="routine-tab-header">
                            <button className="build-routine-button" onClick={() => navigate("/apparatus-selector/")}>Build a Routine</button>
                            <div className="sorting-bar">
                                <p className="sort-text">Sort By : </p>
                                <select value={routineSort} onChange={sortRoutineList} className="sort-skill-select">
                                    <option value="0">Difficulty: low to high</option>
                                    <option value="1">Difficulty: high to low</option>
                                    <option value="2">Alphabetical: a-z</option>
                                    <option value="3">Alphabetical: z-a</option>
                                </select>
                            </div>
                        </div>
                        <div className={`routine-tab ${activeTab === 'all' ? 'active' : ''}`}>
                            {allRoutines.length === 0 ? (
                                <div className="empty-state">
                                    <p>You have no Routines</p>
                                    <Link to="/apparatus-selector">
                                        <button className="build-routine-button">Build a Routine</button>
                                    </Link>
                                </div>
                            ) : (
                                allRoutines.map(routine => (
                                    <RoutineTab key={routine.id} routine={routine} collectionName={collections.find(collection => collection.id === routine.collectionId) ? collections.find(collection => collection.id === routine.collectionId).name : null} setActive={status => handleSetActiveRoutine(routine, status)} onDelete={handleDeleteRoutine} />
                                ))
                            )}
                    </div>    
                   </div>         
                )}
                {activeTab === 'collection' && (
                    <div className="collection-container">
                        {selectedCollectionId ? (
                            <div className="collection-routine-list">
                                <div className="collection-routine-header">
                                    <div className="collection-routine-header-left">
                                        <FaArrowLeft className="back-icon" onClick={() => setSelectedCollectionId(null)} />
                                        {editCollectionName ? (
                                            <div className='edit-text-container'>
                                                <input className="edit-input" value={editCollectionNameValue} onChange={(event) => setEditCollectionNameValue(event.target.value)} />
                                                <button className="edit-submit-btn" onClick={handleCollectionNameUpdated}>Submit</button>
                                                <button className="edit-cancel-btn" onClick={() => setEditCollectionName(false)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <p>{collections.find(collection => collection.id === selectedCollectionId).name}</p>
                                                <FaPencilAlt className="edit-icon" onClick={() => { setEditCollectionName(true); setEditCollectionNameValue(collections.find(collection => collection.id === selectedCollectionId).name); }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="collection-routine-header-right">
                                        <p>{calculateTotalStartValue(getCollectionRoutines())} SV</p>
                                        <FaTrash className="delete-icon" onClick={deleteCollection} />
                                    </div>
                                </div>
                                {getCollectionRoutines().length === 0 ? (
                                    <div className="empty-state">
                                        <p>You have no Routines In this Collection</p>
                                        <Link to="/apparatus-selector">
                                            <button className="build-routine-button">Build a Routine</button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div style={{"height":"100%"}} className="routine-tab">
                                        {getRoutineSet(getCollectionRoutines()).map(routine => (
                                            <RoutineTab key={routine.id} routine={routine} setActive={status => handleSetActiveRoutine(routine, status)} onDelete={handleDeleteRoutine} />
                                        ))}
                                    </div>
                                )}
                            </div>                        
                        ): (
                            <div className="collection-list-container">
                                <div className="header-container">
                                    <div className="add-collection-container">
                                        <input
                                            className="add-collection-input"
                                            value={newCollectionName}
                                            placeholder='Add new collection...'
                                            onChange={(event) => setNewCollectionName(event.target.value)}
                                        />
                                        <button className="edit-submit-btn" onClick={handleCollectionAdded}><FaPlus /></button>
                                    </div>
                                    <div className="sorting-bar">
                                        <p className="sort-text">Sort By : </p>
                                        <select value={collectionSort} onChange={sortCollectionList} className="sort-skill-select">
                                            <option value="0">Difficulty: low to high</option>
                                            <option value="1">Difficulty: high to low</option>
                                            <option value="2">Alphabetical: a-z</option>
                                            <option value="3">Alphabetical: z-a</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="collection-list">
                                    {collections.length === 0 ? (
                                        <p className="empty-message">You have no Collections</p>
                                    ) : (
                                        collections.map((collection) => (
                                            <CollectionTab id={collection.id} name={collection.name} routines={getRoutineSet(getCollectionRoutines(collection.id))} onClick={() => handleCollectionSelected(collection.id)}/>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;