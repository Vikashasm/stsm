import React, { useState } from 'react';
import closeIcon from '../../Images/svgs/closeicon.svg';

export default function Deletepopup(props) {

  return (
    <>
      {
        <div className="delete_popup">
          <div className="d-flex align-items-center justify-content-between">
            <p className="fs-2sm fw-400 black mb-0">Delete</p>
            <img src={closeIcon} alt="closeIcon" />
          </div>
          <p className="fs-2sm fw-500 black text-center mt-5">Are you sure want to delete ?</p>
          <div className="d-flex align-items-center justify-content-end gap-4 mt-5">
            <button className="cancel_btn" onClick={handehidePopup}>
              Cancel
            </button>
            <button className="delete_btn" onClick={handehidePopup}>
              Delete
            </button>
          </div>
        </div>
      }
    </>
  );
}
