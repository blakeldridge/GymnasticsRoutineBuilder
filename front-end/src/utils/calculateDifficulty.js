export function calculateDifficulty(routine) {
    routine = routine.filter(item => item !== null && item !== undefined);
    if (routine.length !== 0){
        console.log(routine[0].apparatus);
        let apparatus = routine[0].apparatus;
        switch (apparatus) {
            case "Floor":
                return calculateFloor(routine);
            case "Pommel Horse":
                return calculatePommel(routine);
            case "Still Rings":
                console.log(calculateRings(routine));
                return calculateRings(routine);
            case "Vault":
                return calculateVault(routine);
            case "Parallel Bars":
                return calculatePbar(routine);
            case "Horizontal Bar":
                return calculateHbar(routine);
        }
    } else {
        return {
            "Start Value": 0.0, 
            "Execution": {
                "value": 0.0,
                "message": `Determined based on the number of skills in the routine.`
            },
            "Difficulty": {
                "value": 0.0,
                "message": `Total value of all skills combined.`
            }
        };
    }
}

function calculateFloor(routine){
    let difficulty = 0.0;
    let requirement = 0.0;
    let requirement_breakdown = [0, 0, 0, 0];
    let bonus = 0.0;
    let bonus_breakdown = [];
    let execution = calculateShortMove(routine);
    let penalty = 0.3;

    // calculate total difficulty of all skills
    for (let skill of routine) {
        difficulty += skill.difficulty;
        if (skill.isPenaltyRequirement && routine.indexOf(skill) == routine.length - 1) {
            penalty = 0.0;
        }

        if (skill.connection) {
            if ((skill.difficulty == 0.2 || skill.difficulty == 0.3) && routine[routine.indexOf(skill) + 1].difficulty >= 0.4){
                bonus += 0.1;
                bonus_breakdown.push([routine.indexOf(skill), routine.indexOf(skill) + 1, 0.1]);
                console.log(bonus_breakdown);
            } else if (skill.difficulty >= 0.4 && routine[routine.indexOf(skill) + 1].difficulty >= 0.4) {
                bonus += 0.2
                bonus_breakdown.push([routine.indexOf(skill), routine.indexOf(skill) + 1, 0.1]);
            }
        }
    }

    // get highest value skill per group
    let requirements = getRequirements(routine);

    // add requirements

    // group 1 is 0.5 requirement
    if (requirements[0] > 0) {
        requirement += 0.5
        requirement_breakdown[0] = 0.5;
    }

    // groups 2,3 and 4 is 0.3 requirement for A, B, C and 0.5 for D+
    for (let i = 0; i < 3; i++) {
        if (requirements[i + 1] > 0.3) {
            requirement += 0.5;
            requirement_breakdown[i + 1] = 0.5;
        } else if (requirements[i + 1] > 0) {
            requirement += 0.3;
            requirement_breakdown[i + 1] = 0.3;
        }
    }

    let bonus_message = "";
    for (let i = 0; i < bonus_breakdown.length; i++) {
        let b = bonus_breakdown[i];
        bonus_message += `Skills ${b[0] + 1} and ${b[1] + 1}: ${b[2]}<br>`;
    }

    return {
        "Start Value": execution + difficulty + requirement + bonus,
        "Execution": {
            "value": execution,
            "message": `Number of skills: ${routine.length}.<br>Execution: ${execution}`
        },
        "Difficulty": {
            "value": difficulty,
            "message": `Total value of all skills combined.`
        },
        "Requirement": {
            "value": requirement,
            "message": `EG I: ${requirement_breakdown[0]}<br>EG II: ${requirement_breakdown[1]}<br>EG III: ${requirement_breakdown[2]}<br>EG IV: ${requirement_breakdown[3]}`
        },
        "Bonus": {
            "value": bonus,
            "message": bonus_message == ""
            ? "Connect two skills to receive a bonus."
            : bonus_message
        },
        "Penalty": {
            "value": penalty,
            "message": penalty !== 0 
            ? "You have not got a double salto as your dismount."
            : "You have received no penalties"
        }
    };
}

function calculatePommel(routine) {
    let difficulty = 0.0;
    let requirement = 0.0
    let requirement_breakdown = [];
    let execution = calculateShortMove(routine);

    // calculate total difficulty of all skills
    for (let skill of routine) {
        difficulty += skill.difficulty;
    }

    // get highest value skill per group
    let requirements = getRequirements(routine);

    // add requirements

    // group 1 is 0.5 requirement
    if (requirements[0] > 0) {
        requirement += 0.5
        requirement_breakdown[0] = 0.5;
    }

    // groups 2,3 is 0.3 requirement for A, B, C and 0.5 for D+
    for (let i = 0; i < 2; i++) {
        if (requirements[i + 1] > 0.3) {
            requirement += 0.5;
            requirement_breakdown[i + 1] = 0.5;
        } else if (requirements[i + 1] > 0) {
            requirement += 0.3;
            requirement_breakdown[i + 1] = 0.3;
        }
    }

    requirement_breakdown[3] = requirements[3]
    requirement += requirements[3]

    return {
        "Start Value": execution + difficulty + requirement,
        "Execution": {
            "value": execution,
            "message": `Number of skills: ${routine.length}.<br>Execution: ${execution}`
        },
        "Difficulty": {
            "value": difficulty,
            "message": `Total value of all skills combined.`
        },
        "Requirement": {
            "value": requirement,
            "message": `EG I: ${requirement_breakdown[0]}<br>EG II: ${requirement_breakdown[1]}<br>EG III: ${requirement_breakdown[2]}<br>EG IV: ${requirement_breakdown[3]}`
        }
    };
}

function calculateRings(routine) {
    let difficulty = 0.0;
    let requirement = 0.0;
    let requirement_breakdown = [];
    let execution = calculateShortMove(routine);
    let penalty = 0.3;

    // calculate total difficulty of all skills
    for (let skill of routine) {
        difficulty += skill.difficulty;
        if (skill.isPenaltyRequirement) {
            penalty = 0.0;
        }
    }

    // get highest value skill per group
    let requirements = getRequirements(routine);

    // add requirements

    // group 1 is 0.5 requirement
    if (requirements[0] > 0) {
        requirement += 0.5
        requirement_breakdown[0] = 0.5;
    }

    // groups 2,3 is 0.3 requirement for A, B, C and 0.5 for D+
    for (let i = 0; i < 2; i++) {
        if (requirements[i + 1] > 0.3) {
            requirement += 0.5;
            requirement_breakdown[i + 1] = 0.5;
        } else if (requirements[i + 1] > 0) {
            requirement += 0.3;
            requirement_breakdown[i + 1] = 0.3;
        }
    }

    requirement_breakdown[3] = requirements[3]
    requirement += requirements[3]

    return {
        "Start Value": execution + difficulty + requirement,
        "Execution": {
            "value": execution,
            "message": `Number of skills: ${routine.length}.<br>Execution: ${execution}`
        },
        "Difficulty": {
            "value": difficulty,
            "message": `Total value of all skills combined.`
        },
        "Requirement": {
            "value": requirement,
            "message": `EG I: ${requirement_breakdown[0]}<br>EG II: ${requirement_breakdown[1]}<br>EG III: ${requirement_breakdown[2]}<br>EG IV: ${requirement_breakdown[3]}`
        },
        "Penalty": {
            "value": penalty,
            "message": penalty !== 0 
            ? "You don't have a swing to handstand element."
            : "You have received no penalties"
        }
    };
}

function calculateVault(routine){
    let difficulty = 0.0;
    if (routine[0] && routine[1]) {
        difficulty = (routine[0].difficulty + routine[1].difficulty) / 2
    }
    return {
        "Start Value": (routine[0] && routine[1] ? 10.0 + (routine[0].difficulty + routine[1].difficulty) / 2 : 0),
        "Vault 1": (routine[0] ? 10.0 + routine[0].difficulty : 0),
        "Vault 2": (routine[1] ? 10.0 + routine[1].difficulty : 0)
    };
}

function calculatePbar(routine) {
    let difficulty = 0.0;
    let requirement = 0.0
    let requirement_breakdown = [];
    let execution = calculateShortMove(routine);

    // calculate total difficulty of all skills
    for (let skill of routine) {
        difficulty += skill.difficulty;
    }

    // get highest value skill per group
    let requirements = getRequirements(routine);

    // add requirements

    // group 1 is 0.5 requirement
    if (requirements[0] > 0) {
        requirement += 0.5
        requirement_breakdown[0] = 0.5;
    }

    // groups 2,3 is 0.3 requirement for A, B, C and 0.5 for D+
    for (let i = 0; i < 2; i++) {
        if (requirements[i + 1] > 0.3) {
            requirement += 0.5;
            requirement_breakdown[i + 1] = 0.5;
        } else if (requirements[i + 1] > 0) {
            requirement += 0.3;
            requirement_breakdown[i + 1] = 0.3;
        }
    }

    requirement_breakdown[3] = requirements[3]
    requirement += requirements[3]

    return {
        "Start Value": execution + difficulty + requirement,
        "Execution": {
            "value": execution,
            "message": `Number of skills: ${routine.length}.<br>Execution: ${execution}`
        },
        "Difficulty": {
            "value": difficulty,
            "message": `Total value of all skills combined.`
        },
        "Requirement": {
            "value": requirement,
            "message": `EG I: ${requirement_breakdown[0]}<br>EG II: ${requirement_breakdown[1]}<br>EG III: ${requirement_breakdown[2]}<br>EG IV: ${requirement_breakdown[3]}`
        }
    };
}

function calculateHbar(routine) {
    let difficulty = 0.0;
    let requirement = 0.0;
    let requirement_breakdown = [0, 0, 0, 0];
    let bonus = 0.0;
    let bonus_breakdown = [];
    let execution = calculateShortMove(routine);
    let penalty = 0.3;

    // calculate total difficulty of all skills
    for (let skill of routine) {
        difficulty += skill.difficulty;
        if (skill.isPenaltyRequirement && routine.indexOf(skill) == routine.length - 1) {
            penalty = 0.0;
        }

        if (skill.connection) {
            if ((skill.difficulty == 0.2 || skill.difficulty == 0.3) && routine[routine.indexOf(skill) + 1].difficulty >= 0.4){
                bonus += 0.1;
                bonus_breakdown.push([routine.indexOf(skill), routine.indexOf(skill) + 1, 0.1]);
                console.log(bonus_breakdown);
            } else if (skill.difficulty >= 0.4 && routine[routine.indexOf(skill) + 1].difficulty >= 0.4) {
                bonus += 0.2
                bonus_breakdown.push([routine.indexOf(skill), routine.indexOf(skill) + 1, 0.1]);
            }
        }
    }

    // get highest value skill per group
    let requirements = getRequirements(routine);

    // add requirements

    // group 1 is 0.5 requirement
    if (requirements[0] > 0) {
        requirement += 0.5
        requirement_breakdown[0] = 0.5;
    }

    // groups 2,3 and 4 is 0.3 requirement for A, B, C and 0.5 for D+
    for (let i = 0; i < 2; i++) {
        if (requirements[i + 1] > 0.3) {
            requirement += 0.5;
            requirement_breakdown[i + 1] = 0.5;
        } else if (requirements[i + 1] > 0) {
            requirement += 0.3;
            requirement_breakdown[i + 1] = 0.3;
        }
    }

    requirement_breakdown[3] = requirements[3]
    requirement += requirements[3]

    let bonus_message = "";
    for (let i = 0; i < bonus_breakdown.length; i++) {
        let b = bonus_breakdown[i];
        bonus_message += `Skills ${b[0] + 1} and ${b[1] + 1}: ${b[2]}<br>`;
    }

    return {
        "Start Value": execution + difficulty + requirement + bonus,
        "Execution": {
            "value": execution,
            "message": `Number of skills: ${routine.length}.<br>Execution: ${execution}`
        },
        "Difficulty": {
            "value": difficulty,
            "message": `Total value of all skills combined.`
        },
        "Requirement": {
            "value": requirement,
            "message": `EG I: ${requirement_breakdown[0]}<br>EG II: ${requirement_breakdown[1]}<br>EG III: ${requirement_breakdown[2]}<br>EG IV: ${requirement_breakdown[3]}`
        },
        "Bonus": {
            "value": bonus,
            "message": bonus_message == ""
            ? "Connect two skills to receive a bonus."
            : bonus_message
        }
    };
}

// get the highest valued skill per skill group
function getRequirements(routine) {
    let requirements = [0, 0, 0, 0];
    for (let skill of routine) {
        if (skill.difficulty > requirements[skill.group - 1]){
            requirements[skill.group - 1] = skill.difficulty;
        }
    }

    return requirements;
}

// calculate short routine execution
function calculateShortMove(routine) {
    let execution = 10.0;
    if (routine.length == 0) {
        execution = 0.0;
    } else if (routine.length < 6) {
        execution -= 3 + (5 - routine.length);
    }
    return execution;
}