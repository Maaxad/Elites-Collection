import React from 'react';
import './adminpage.css'; // CSS file for styling the modal

function Modal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{message}</h3>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-button confirm">
            Yes, Delete
          </button>
          <button onClick={onCancel} className="modal-button cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
