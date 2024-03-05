import React, { useState, useEffect } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import search from "../../Images/svgs/search.svg";
import dropdown from "../../Images/svgs/dropdown_icon.svg";
import dropdownDots from "../../Images/svgs/dots2.svg";
import eye_icon from "../../Images/svgs/eye.svg";
import pencil_icon from "../../Images/svgs/pencil.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import delete_icon from "../../Images/svgs/delte.svg";
import updown_icon from "../../Images/svgs/arross.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import closeicon from "../../Images/svgs/closeicon.svg";
import saveicon from "../../Images/svgs/saveicon.svg";
import {
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UseServiceContext } from "../../context/ServiceAreasGetter";
import Deletepopup from "../popups/Deletepopup";
import Updatepopup from "../popups/Updatepopup";

const ServiceArea = () => {
  const { ServiceData, addServiceData, deleteServiceData, updateServiceData } =
    UseServiceContext();
  const [addsServicePopup, setAddsServicePopup] = useState(false);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [AreaName, SetAreaName] = useState("");
  const [postalCode, SetPostalCode] = useState();
  const [status, setStatus] = useState();
  const pubref = useRef();
  const hideref = useRef();

  const [selectedValue, setSelectedValue] = useState("1 Day");
  const [searchvalue, setSearchvalue] = useState("");

  
 

  const [order, setorder] = useState("ASC");
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...ServiceData];

    if (order === "ASC") {
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateServiceData(sortedData);
  };



 

  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = ServiceData.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [ServiceData]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = ServiceData.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateServiceData(updatedData);
    setSelectAll(!selectAll);
  };
 
  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/
  if (loaderstatus) {
    return (
      <>
        <div className="loader">
          <h3 className="heading">Uploading Data... Please Wait</h3>
        </div>
      </>
    );
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">
                List of Delivery Mans
              </h1>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
              <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input  "
                  placeholder="Search for ServiceAreas..."
                  onChange={(e) => setSearchvalue(e.target.value)}
                />
              </div>
              <Link className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Delivery Man
              </Link>
            </div>
          </div>
          {/* categories details  */}
          <div className="p-3 mt-3 bg-white product_shadow mt-4">
            <div className="overflow_xl_scroll line_scroll">
              <div className="categories_xl_overflow_X ">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th
                        onClick={() => sorting("AreaName")}
                        className="py-3 ps-3  cursor_pointer mx_160"
                      >
                        <div className="d-flex align-items-center gap-3 ">
                          <label class="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleMainCheckboxChange}
                            />
                            <span class="checkmark"></span>
                          </label>
                          <p className="fw-400  fs-sm black mb-0 ms-2">
                            Name
                            <span>
                              <img
                                className="ms-2 cursor_pointer"
                                width={20}
                                src={shortIcon}
                                alt="short-icon"
                              />
                            </span>
                          </p>
                        </div>
                      </th>
                      <th className="mx_100 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">Work type</h3>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Total delivery
                        </h3>
                      </th>
                      <th
                        onClick={() => sorting("ServiceStatus")}
                        className="mx_140 cursor_pointer"
                      >
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Status
                          <span>
                            <img
                              className="ms-2 cursor_pointer"
                              width={20}
                              src={shortIcon}
                              alt="short-icon"
                            />
                          </span>
                        </p>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Service area
                        </h3>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Contact</h3>
                      </th>
                      <th className="mw-90 p-3 me-1 text-center">
                        <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {ServiceData.filter((data) => {
                      return searchvalue.toLowerCase() === ""
                        ? data
                        : data.AreaName.toLowerCase().includes(searchvalue);
                    }).map((data, index) => {
                      return (
                        <tr className="product_borderbottom">
                       
                      
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <ToastContainer />
                {/* <div className=""></div> */}
              </div>
             
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ServiceArea;