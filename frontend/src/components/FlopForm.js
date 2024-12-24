/**
 * should have a skill list:
 * bertonceji (1/2 sohn)
 * 1/2 bezugo
 * 1 handle loop
 * DSA
 * DSB
 * 180 or 270 russian
 * 360 or 540 russian
 * 720 or 960 russian
 * 1080 + russian
 * 
 * 
 * Calculate the flop:
 * draggable skills into droppable areas, max 4 or 5 areas (maybe a series of dropdown elements)
 * DSA only at end of flop
 * bertonceji and davtyan only at beginning
 * 
 * types : 
 * russian flops : 1 circle or stockli into russian w/ 360 or 540 = D, each russian more to 3 = + 1
 *                 2 circle or stockli into russian w/ 180 or 270 = D, each russian more to 3 = + 1
 *                 bertonceji/davytan into 1 circle into russian w/ 180 or 270 = E, each russian more to 3 = +1
 * 
 * stockli flops : DSB + DSB + DSA (D)
 *                 circle + circle + DSB (D)
 *                 circle + DSB + DSB + DSA (E) or DSB + DSB + circle + DSA
 *                 circle + DSB + DSA (D) or DSB + circle + DSA
 *                 bertonceji/davtyan + circle + DSB (E)
 *                 bertonceji/davtyan + circle + DSB + DSB + DSA (F)
 */
import React, { useState, useEffect } from "react";
import { FaTrash } from 'react-icons/fa';
import "../css/FlopForm.css";

const FlopForm = ({ isOpen, onCancel, onAddedSkill }) => {
    const [skills, setSkills] = useState(["", "", "", "", ""]); // 5 slots for skills
    const [flopValue, setFlopValue] = useState("N/A");
    const [visibleDropdowns, setVisibleDropdowns] = useState(3); // Start with 3 visible dropdowns
    const [addDisabled, setAddDisabled] = useState(true); // Disable "Add" button initially

    // Skill options for each slot
    const skillOptions = [
        ["Bertonceji", "Davtyan", "Circle", "DSB"],  // First slot can start with any valid skill
        ["Circle", "DSB", "360 or 540 Russians", "720 or 960 Russians", "1080+ Russians"],  // Second slot
        ["Circle", "DSB", "180 or 270 Russians", "360 or 540 Russians", "720 or 960 Russians", "1080+ Russians", "DSA"], // Third slot
        ["Circle", "DSB", "DSA"],  // Fourth slot
        ["Circle", "DSB", "DSA"],  // Fifth slot
    ];


    // Event handler to update selected skill
    const handleSelectChange = (index, value) => {
        const newSkills = [...skills];
        newSkills[index] = value;
        setSkills(newSkills);

        // Check if all visible dropdowns are filled
        const allFilled = newSkills.slice(0, visibleDropdowns).every(skill => skill !== "");
        setAddDisabled(!allFilled); // Enable the "+" button if all visible dropdowns are filled
    };

    const handleReset = () => {
        setSkills(["", "", "", "", ""]);
        setVisibleDropdowns(3); // Reset to showing only 3 dropdowns
        setAddDisabled(true); // Disable the "+" button
    };

    const handleAddDropdown = () => {
        if (visibleDropdowns < 5) {
            setVisibleDropdowns(visibleDropdowns + 1);
        }
    };

    const getFlopSequence = () => {
        let flopSequence = "";
        for (let skill of skills) {
            if (skill) {
                flopSequence += skill + " + "
            }
        }
        return flopSequence.slice(0, -3);
    }

    // Calculate flop value based on skills
    const calculateFlopValue = () => {
        let customFlop = skills.filter(skill => skill); // Filter out empty skills

        const countCircles = customFlop.filter(skill => skill === "Circle").length;
        const countDSBs = customFlop.filter(skill => skill === "DSB").length;
        const hasDSA = customFlop.includes("DSA");

        // Initialize value
        let value = "Can not identify flop sequence.";

        // Calculate bertonceji or davtyan flops
        if ((customFlop[0] === "Bertonceji" || customFlop[0] === "Davtyan") && customFlop[1] === "Circle") {
            // Calculate for russian flops
            if (customFlop[2] === "180 or 270 Russians") {
                value = "E";
            } else if (customFlop[2] === "360 or 540 Russians") {
                value = "F";
            } else if (customFlop[2] === "720 or 960 Russians") {
                value = "G";
            } else if (customFlop[2] === "1080+ Russians") {
                value = "H";
            }
            // Calculate for stockli flops
            else if (countDSBs === 2) {
                value = "F";
            } else if (countDSBs === 1) {
                value = "E";
            }
        }
        // Calculate flops from circles or DSB
        else if (customFlop[0] === "Circle" || customFlop[0] === "DSB") {
            // Calculate for russian flops
            if (customFlop[1] === "Circle" || customFlop[1] === "DSB") {
                if (customFlop[2] === "180 or 270 Russians") {
                    value = "D";
                } else if (customFlop[2] === "360 or 540 Russians") {
                    value = "E";
                } else if (customFlop[2] === "720 or 960 Russians") {
                    value = "F";
                } else if (customFlop[2] === "1080+ Russians") {
                    value = "G";
                }
            } else {
                if (customFlop[1] === "360 or 540 Russians") {
                    value = "D";
                } else if (customFlop[1] === "720 or 960 Russians") {
                    value = "E";
                } else if (customFlop[1] === "1080+ Russians") {
                    value = "F";
                }
            }

            if (countDSBs === 2) {
                if (countCircles > 0) {
                    value = "E";
                } else if (hasDSA) {
                    value = "D";
                }
            } else if (countDSBs === 1) {
                if (countCircles === 2 || (countCircles === 1 && hasDSA)) {
                    value = "D";
                }
            }
        }

        setFlopValue(value);
    };

    // Recalculate flop value when skills change
    useEffect(() => {
        calculateFlopValue();
    }, [skills]);

    if (!isOpen) {
        return null; // Don't render anything if the modal is closed
    }

    return (
        <div className="flop-modal-overlay">
            <div className="flop-modal">
                <div>
                    {skillOptions.slice(0, visibleDropdowns).map((options, index) => (
                        <select
                            key={index}
                            value={skills[index]}
                            onChange={(e) => handleSelectChange(index, e.target.value)}
                        >
                            <option className="flop-skill-option" value="">Select a skill</option>
                            {options.map((option, i) => (
                                <option key={i} value={option} className="flop-skill-option">
                                    {option}
                                </option>
                            ))}
                        </select>
                    ))}

                    <button onClick={handleAddDropdown} disabled={visibleDropdowns >= 5} className="flop-editor-button">
                        +
                    </button>

                    <button onClick={handleReset} className="flop-editor-button">
                        <FaTrash />
                    </button>
                </div>
                <div>
                    {flopValue.length === 1 ? (
                        <>
                            <h2>This flop is worth: </h2>
                            <h2>{flopValue}</h2>
                        </>
                    ) : (
                        <h2>{flopValue}</h2>
                    )}
                </div>
                <div className="handle-button-container">
                    <button className="flop-handle-button cancel-flop-button" onClick={() => {
                        onCancel();
                        handleReset();
                    }}>Cancel</button>
                    <button className="flop-handle-button" onClick={() => {
                        onAddedSkill(getFlopSequence(), flopValue);
                        handleReset();
                    }
                    }>Add Skill</button>
                </div>
            </div>
        </div>
    );
};

export default FlopForm;

