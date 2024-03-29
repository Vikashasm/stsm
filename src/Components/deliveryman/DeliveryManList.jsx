import React, { useState, useEffect } from 'react';
import addicon from '../../Images/svgs/addicon.svg';
import search from '../../Images/svgs/search.svg';
import dropdown from '../../Images/svgs/dropdown_icon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import delete_icon from '../../Images/svgs/delte.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import shortIcon from '../../Images/svgs/short-icon.svg';
import closeicon from '../../Images/svgs/closeicon.svg';
import saveicon from '../../Images/svgs/saveicon.svg';
import { doc, deleteDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UseServiceContext } from '../../context/ServiceAreasGetter';
import Deletepopup from '../popups/Deletepopup';
import Updatepopup from '../popups/Updatepopup';
import { ActionIcon } from '../../Common/Icon';
import { UseDeliveryManContext } from '../../context/DeliverymanGetter';
const DeliveryManList = () => {
  const { DeliveryManData, deleteDeliveryManData, updateDeliveryManData } = UseDeliveryManContext();
  const [loaderstatus, setLoaderstatus] = useState(false);

  const [selectedValue, setSelectedValue] = useState('1 Day');
  const [searchvalue, setSearchvalue] = useState('');
  console.log('delivery man data ', DeliveryManData);
  const [order, setorder] = useState('ASC');
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...DeliveryManData];

    if (order === 'ASC') {
      sortedData.sort((a, b) => {
        const valueA = getProperty(a, col).toLowerCase();
        const valueB = getProperty(b, col).toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = getProperty(a, col).toLowerCase();
        const valueB = getProperty(b, col).toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateDeliveryManData(sortedData);
  };

  const getProperty = (obj, path) => {
    const keys = path.split('.');
    let result = obj;
    for (let key of keys) {
      result = result[key];
    }
    return result;
  };

  



  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = DeliveryManData.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [DeliveryManData]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = DeliveryManData.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateDeliveryManData(updatedData);
    setSelectAll(!selectAll);
  };
  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...DeliveryManData];
    updatedData[index].checked = !DeliveryManData[index].checked;
    updateDeliveryManData(updatedData);
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
              <h1 className="fw-500   black fs-lg mb-0">List of Delivery Mans</h1>
            </div>
            <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
              <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  className="fw-400 categorie_input  "
                  placeholder="Search in Delivery Mans..."
                  onChange={(e) => setSearchvalue(e.target.value)}
                />
              </div>
              <Link
                to="/deliveryman/addnewdeliveryman"
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Delivery Man
              </Link>
            </div>
          </div>
          {/* categories details  */}
          <div className="p-3 mt-3 bg-white product_shadow mt-4">
            <div className="overflow_xl_scroll line_scroll">
              <div className="  min_width_1350">
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th
                        onClick={() => sorting('basic_info.name')}
                        className="py-3 ps-3  cursor_pointer ">
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
                      <th className="mx_160 px-2">
                        <h3 className="fs-sm fw-400 black mb-0">Work type</h3>
                      </th>
                      <th className="mx_140 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Total Order’s</h3>
                      </th>
                      <th
                        onClick={() => sorting('status')}
                        className="mx_140 cursor_pointer">
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
                      <th className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Verification</h3>
                      </th>
                      <th className="mx_160 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Service area</h3>
                      </th>
                      <th className="mx_140 ps-3">
                        <h3 className="fs-sm fw-400 black mb-0">Contact</h3>
                      </th>
                      <th className="mx_100 p-3 me-1 text-center">
                        <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {DeliveryManData.filter((data) => {
                      return searchvalue.toLowerCase() === ''
                        ? data
                        : data.basic_info.name.toLowerCase().includes(searchvalue);
                    }).map((data, index) => {
                      return (
                        <tr className="product_borderbottom">
                          <td className="py-3 ps-3 ">
                            <div className="d-flex align-items-center gap-3 ">
                              <label class="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={data.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span class="checkmark"></span>
                              </label>
                              <Link to={`/deliveryman/deliverymanprofile/${data.d_id}`}>
                                <p className="fw-400 fs-sm black color_blue mb-0 ms-2">
                                  {data.basic_info.name}
                                </p>
                                <p className="fw-400 fs-xs black color_blue mb-0 ms-2">
                                  ID {data.d_id}
                                </p>
                              </Link>
                            </div>
                          </td>
                          <td className="px-2 mx_160">
                            <h3 className="fs-sm fw-400 black mb-0">{data.job_info.shift}</h3>
                          </td>
                          <td className="mx_140 ps-5">
                            <h3 className="fs-sm fw-400 black ">10</h3>
                          </td>
                          <td className="px-2 mx_140">
                            <h3
                              className={`fs-sm fw-400 ${data.status === 'online' ? 'status_btn_green' : 'status_btn_red'
                                } mb-0`}>
                              {data.status}
                            </h3>
                            {/* <h3 className="fs-sm fw-400 status_btn_red mb-0">online</h3> */}
                          </td>
                          <td className="ps-3 mx_160">
                            <h3
                              className={`fs-sm fw-400 status_btn_green mb-0  ${data.profile_status === 'NEW' ? ' on_credit_bg' : data.profile_status === "APPROVED" ? 'green stock_bg ' : 'status_btn_red'
                                } `}>
                              {data.profile_status === 'NEW' ? 'PENDING' : data.profile_status}
                            </h3>
                            {/* <h3 className="fs-sm fw-400 status_btn_red mb-0">Rejected</h3> */}
                          </td>
                          <td className="ps-3 mx_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              <button className="service_area_show_btn fs-sm fw-400">
                                Show
                              </button>
                            </h3>
                          </td>
                          <td className=" mx_140 ps-3">
                            <h3 className="fs-sm fw-400 black mb-0 ">
                              +91 {data.basic_info.phone_no}
                            </h3>
                          </td>
                          <td className="text-center mx_100">
                            {data.is_verified === true && data.status === "online" ? (
                              <Link to={`inventory/${data.uid}`}>
                                <ActionIcon />
                              </Link>
                            ) : (
                              <div>
                                <ActionIcon />
                              </div>
                            )}
                          </td>
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

export default DeliveryManList;
