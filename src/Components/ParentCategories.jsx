import React, { useState } from 'react';
import addicon from '../Images/svgs/addicon.svg';
import search from '../Images/svgs/search.svg';
import dropdownDots from '../Images/svgs/dots2.svg';
import eye_icon from '../Images/svgs/eye.svg';
import pencil_icon from '../Images/svgs/pencil.svg';
import delete_icon from '../Images/svgs/delte.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import updown_icon from '../Images/svgs/arross.svg';
import categoryImg from '../Images/Png/mobile_icon_40.png';
import saveicon from '../Images/svgs/saveicon.svg';
import Modifyproduct from './Modifyproduct';
import { useRef } from 'react';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CategoryItems } from '../Common/Helper';
const Categories = () => {
  const [data, setData] = useState([]);
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [name, setName] = useState();
  const [imageupload, setImageupload] = useState('');
  const [addCatPopup, setAddCatPopup] = useState(false);
  const [status, setStatus] = useState();
  const pubref = useRef();
  const hidref = useRef();
  const handleModifyClicked = (index) => {
    setSelectedCategory(index === selectedCategory ? null : index);
  };
  function handelUpload(e) {
    setImageupload(e.target.files[0]);
  }
  function handleDelete22(index) {
    setImageupload();
  }
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'sub_categories'));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push({ id: doc.id, ...doc.data() });
        });
        setData([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          list.push({ id: doc.id, ...doc.data() });
        });
        setMainCategory([...list]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'sub_categories', id)).then(() => {
        setData(data.filter((item) => item.id !== id));
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
      {addCatPopup === true ? <div className="bg_black_overlay"></div> : ''}
      <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500   black fs-lg mb-0">Parent Categories</h1>
          </div>
          <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
            <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                className="fw-400 categorie_input  "
                placeholder="Search for categories..."
              />
            </div>
            <div>
              <button
                onClick={() => setAddCatPopup(true)}
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Category
              </button>
              {addCatPopup === true ? (
                <div className="parent_category_popup">
                  <form action="">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="fs-4 fw-400 black mb-0">New Parent Category</p>
                      <div className="d-flex align-items-center gap-3">
                        <button onClick={() => setAddCatPopup(false)} className="reset_border">
                          <button className="fs-sm fw-400 reset_btn border-0 px-sm-3 px-2 py-2 ">
                            Cancel
                          </button>
                        </button>
                        <button
                          type="submit"
                          className="d-flex align-items-center px-sm-3 px-2 py-2  save_btn">
                          <img src={saveicon} alt="saveicon" />
                          <p className="fs-sm fw-400 black mb-0 ps-1">Save</p>
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h2 className="fw-400 fs-2sm black mb-0">Basic Information</h2>
                      {/* ist input */}
                      <label htmlFor="Name" className="fs-xs fw-400 mt-3 black">
                        Name
                      </label>
                      <br />
                      <input
                        type="text"
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="Enter product name"
                        id="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />{' '}
                      <br />
                      {/* 2nd input */}
                      <label htmlFor="des" className="fs-xs fw-400 mt-3 black">
                        Category Image
                      </label>{' '}
                      <br />
                      <div className="d-flex flex-wrap  gap-4 mt-3 align-items-center">
                        {!imageupload ? (
                          <input
                            type="file"
                            id="file22"
                            hidden
                            accept="/*"
                            multiple
                            onChange={handelUpload}
                          />
                        ) : (
                          <div className=" d-flex flex-wrap">
                            <div className="position-relative ">
                              <img
                                className="mobile_image object-fit-cover"
                                src={URL.createObjectURL(imageupload)}
                                alt=""
                              />
                              <img
                                className="position-absolute top-0 end-0 cursor_pointer"
                                src={deleteicon}
                                alt="deleteicon"
                                onClick={handleDelete22}
                              />
                            </div>
                          </div>
                        )}

                        {!imageupload ? (
                          <label
                            htmlFor="file22"
                            className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center">
                            + Add Media
                          </label>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                      <div className="d-flex align-items-center gap-5">
                        <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                          <label class="check fw-400 fs-sm black mb-0">
                            Published
                            <input
                              ref={pubref}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setStatus('published');
                                  hidref.current.checked = false;
                                }
                              }}
                              type="checkbox"
                            />
                            <span class="checkmark"></span>
                          </label>
                        </div>
                        <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                          <label class="check fw-400 fs-sm black mb-0">
                            Hidden
                            <input
                              ref={hidref}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setStatus('hidden');
                                  pubref.current.checked = false;
                                }
                              }}
                              type="checkbox"
                            />
                            <span class="checkmark"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        {/* categories details  */}
        <div className="p-3 mt-3 bg-white product_shadow">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X">
              <table className="w-100">
                <tr className="product_borderbottom">
                  <th className="py-3 ps-3">
                    <div className="d-flex align-items-center gap-3">
                      <label class="check1 fw-400 fs-sm black mb-0">
                        Name
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={() => setSelectAll(!selectAll)}
                        />
                        <span class="checkmark"></span>
                      </label>
                    </div>
                  </th>
                  <th className="mx_160 ps-4">
                    <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                  </th>
                  <th className="mx_160">
                    <h3 className="fs-sm fw-400 black mb-0">Visibility</h3>
                  </th>
                  <th className="mw-90 p-3 me-1">
                    <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                  </th>
                </tr>
                {data.map((value, index) => {
                  return (
                    <tr key={index} className="product_borderbottom">
                      <td className="py-3 ps-3">
                        <div className="d-flex align-items-center gap-3">
                          <label className="check1 fw-400 fs-sm black mb-0">
                            <div className="d-flex align-items-center">
                              <div className="w_40">
                                <img src={categoryImg} alt="categoryImg" />
                              </div>
                              <div className="ps-3 ms-1">
                                <p className="fw-400 fs-sm black mb-0">{value.title}</p>
                              </div>
                            </div>
                            <input type="checkbox" checked={selectAll} />
                            <span className="checkmark me-5"></span>
                          </label>
                        </div>
                      </td>
                      <td className="ps-4">
                        <h3 className="fs-sm fw-400 black mb-0 width_10">10</h3>
                      </td>
                      <td>
                        <h3 className="fs-sm fw-400 black mb-0 width_10 color_green">
                          {value.status}
                        </h3>
                      </td>
                      <td className="text-center">
                        <div class="dropdown">
                          <button
                            class="btn dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <img
                              // onClick={() => {
                              //   handleDelete(value.id);
                              // }}
                              src={dropdownDots}
                              alt="dropdownDots"
                            />
                          </button>
                          <ul
                            class="dropdown-menu categories_dropdown"
                            aria-labelledby="dropdownMenuButton1">
                            <li>
                              <div class="dropdown-item" href="#">
                                <div className="d-flex align-items-center categorie_dropdown_options">
                                  <img src={eye_icon} alt="" />
                                  <p className="fs-sm fw-400 black mb-0 ms-2">View Details</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="dropdown-item" href="#">
                                <div className="d-flex align-items-center categorie_dropdown_options">
                                  <img src={pencil_icon} alt="" />
                                  <p className="fs-sm fw-400 black mb-0 ms-2">Edit Product</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="dropdown-item" href="#">
                                <div className="d-flex align-items-center categorie_dropdown_options">
                                  <img src={updown_icon} alt="" />
                                  <p className="fs-sm fw-400 green mb-0 ms-2">Change to Hidden</p>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div class="dropdown-item" href="#">
                                <div className="d-flex align-items-center categorie_dropdown_options">
                                  <img src={delete_icon} alt="" />
                                  <p className="fs-sm fw-400 red mb-0 ms-2">Delete</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
