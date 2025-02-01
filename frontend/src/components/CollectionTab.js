import React, { useState, useEffect } from 'react';

import getApparatusIcon from '../utils/apparatusIconGetter';

import "../css/CollectionTab.css";


const CollectionTab = ({id, name, routines, onClick}) => {
    return (
        <div onClick={() => onClick(id)} className="collection-entry">
            <div className="collection-metadata">
                <p className="collection-entry-name">{name}</p>
                <p className="collection-entry-sv">{routines.reduce((total, routine) => total + JSON.parse(routine.difficulty)["Start Value"], 0).toFixed(2)}</p>
            </div>
            <div className="collection-routine-container">
                {routines.map((routine) => {
                    return (
                        <div className="collection-routine-info">
                            {getApparatusIcon(routine.apparatus, "collection-routine-icon")}
                            <p>{JSON.parse(routine.difficulty)["Start Value"].toFixed(2)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CollectionTab;