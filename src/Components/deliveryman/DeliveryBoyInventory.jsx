import React, { useState, useEffect } from "react";
import addicon from "../../Images/svgs/addicon.svg";
import shortIcon from "../../Images/svgs/short-icon.svg";
import profile_image from "../../Images/Png/customer_profile.png";
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
import Loader from "../Loader";

import { useProductsContext } from "../../context/productgetter";

const DeliveryBoyInventory = () => {

  const { productData }  = useProductsContext()
  

  const [loaderstatus , setLoaderstatus] = useState(false)
  const [selectedValue , setSelectedValue] = useState()

  // Function to handle the selection of an item
  const handleSelectItem = (value) => {
    // Update the selected value in the state
    setSelectedValue(value);
  };

  
  

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/
  if (loaderstatus) {
    return (<Loader></Loader>)
    
  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between ">
            <div className="d-flex align-items-center mw-300 p-2">
              <div>
                <img
                  src={profile_image}
                  alt="mobileicon"
                  className="items_images"
                />
              </div>
              <div className="ps-3">
                <p className="fs-sm fw-400 black mb-0">John Doe</p>
                <p className="fs-xxs fw-400 fade_grey mb-0">john@example.com</p>
              </div>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between gap-3">
              <Link className="update_entry text-white d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                Update Entry
              </Link>
            </div>
          </div>
          <div className="  gap-2 gap-sm-0  p-3 mt-3 bg-white product_shadow mt-4 ">
            <div className="row mb-3 align-items-center">
              <div className="col-6">
                <div className="d-flex align-items-center justify-content-between  p-2 quantity_bg">
                  <p className="ff-outfit fw-400 fs_sm mb-0 fade_grey">
                    Select Product
                  </p>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-5 ms-5">
                  <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                    SKU : 9H8967H
                  </p>
                  <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                  Brand : Brand Name
                  </p>
                </div>
                <p className="ff-outfit mb-0 fw-400 fs_sm fade_grey">
                Unit : KG
                  </p>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-between mw-300 p-2 quantity_bg">
                <p className="ff-outfit fw-400 fs_sm mb-0 fade_grey">
                  Quantity
                </p>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 10L12 15L17 10"
                    stroke="black"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div className="d-flex align-itmes-center justify-content-center justify-content-md-between gap-3">
                <Link className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                  <img
                    className="me-1"
                    width={20}
                    src={addicon}
                    alt="add-icon"
                  />
                  Add to Van
                </Link>
              </div>
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
                        className="py-3 ps-3 w-100 cursor_pointer"
                      >
                        <div className="d-flex align-items-center gap-3 min_width_300">
                          <label class="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              // checked={selectAll}
                              // onChange={handleMainCheckboxChange}
                            />
                            <span class="checkmark"></span>
                          </label>
                          <p className="fw-400 fs-sm black mb-0 ms-2">
                            Items
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
                      <th className="mx_160 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">SKU</h3>
                      </th>
                      <th className="mw-200 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Brand</h3>
                      </th>
                      <th
                      
                        className="mx_140 cursor_pointer"
                      >
                        <p className="fw-400 fs-sm black mb-0 ms-2">Quantity</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    <tr className="product_borderbottom">
                      <td className="py-3 ps-3 w-100">
                        <div className="d-flex align-items-center gap-3 min_width_300">
                          <label class="check1 fw-400 fs-sm black mb-0">
                            <input
                              type="checkbox"
                              // checked={data.checked || false}
                              // onChange={() => handleCheckboxChange(index)}
                            />
                            <span class="checkmark"></span>
                          </label>
                          <div className="d-flex align-items-center ms-1">
                            <p className="fw-400 fs-sm color_green mb-0 ms-2">
                              Ghee
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 mx_160">
                        <h3 className="fs-sm fw-400 black mb-0">G587H69OJ</h3>
                      </td>
                      <td className="ps-4 mw-200">
                        <h3 className="fs-sm fw-400 black mb-0">Brand Name</h3>
                      </td>
                      <td className="mx_140">
                        <h3 className="fs-sm fw-400 black mb-0 color_green ms-3">
                          10KG
                        </h3>
                      </td>
                    </tr>
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

export default DeliveryBoyInventory;
