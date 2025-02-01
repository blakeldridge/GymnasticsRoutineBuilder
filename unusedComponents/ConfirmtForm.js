import React from "react";

const ConfirmForm = ({ warning, onConfirm, onCancel }) => {

    return (
        <div>
            <h2>{warning}</h2>
            <button onClick={onConfirm}>Confirm</button>
            <button onCLick={onCancel}>Cancel</button>
        </div>
    );

};

export default ConfirmForm;