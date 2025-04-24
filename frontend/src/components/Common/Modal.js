import React from "react";
import "../../styles/Modal.css"; 

const Modal = ({ show, title, children, onClose, onSave }) => {
  if (!show) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {onSave && (
            <button className="btn btn-primary" onClick={onSave}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
