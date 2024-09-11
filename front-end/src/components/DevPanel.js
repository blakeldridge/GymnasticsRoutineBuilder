import React from 'react';
import AddSkillForm from './AddSkillForm';
import SkillList from './SkillList';

const DeveloperPanel = () => {
    return (
        <div className="App">
            <h1>Gymnastics Skill Manager</h1>
            <AddSkillForm />
            <SkillList />
        </div>
    );
}

export default DeveloperPanel;
