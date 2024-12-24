import React from 'react';
import { Link } from 'react-router-dom';
import '../css/apparatusSelector.css';

const apparatusOptions = [
    'Floor',
    'Pommel Horse',
    'Rings',
    'Vault',
    'Parallel Bars',
    'High Bar'
];

const ApparatusSelector = () => {
    return (
        <div>
            <div className="apparatus-options">
                {apparatusOptions.map((app, index) => (
                        <Link to={app.toLowerCase().replace(/ /g, '-')}>
                            <button className="apparatus-button">{app}</button>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default ApparatusSelector;