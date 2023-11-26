import React, { useState, useEffect } from 'react';
import saveicon from '../Images/svgs/saveicon.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import addIcon from '../Images/svgs/addicon.svg';
import { Col, Row } from 'react-bootstrap';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '../firebase';
import { useRef } from 'react';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [shortDes, setShortDes] = useState('');
  const [longDes, setLongDes] = useState('');
  const [varient, setVarient] = useState(false);
  const [varientvalue, setVarientvalue] = useState('M');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountType, setDiscountType] = useState('Amount');
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState('');
  const [delivery, setDelivery] = useState('');
  const [sku, setSku] = useState('');
  const [totalStock, setTotalStock] = useState('');
  const [categories, setCategories] = useState('');
  const [imageUpload22, setImageUpload22] = useState([]);
  const [data, setData] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  const [catval, setCatval] = useState([]);
  const [loaderstatus, setLoaderstatus] = useState(false);

  const pubref = useRef();
  const hidref = useRef();

  function handleReset() {
    setName();
    setShortDes();
    setLongDes();
    setOriginalPrice();
    setDiscountType();
    setCategories();
    setDiscount();
    setStatus();
    setSku();
    setTotalStock();
    setImageUpload22([]);
    pubref.current.checked = false;
    hidref.current.checked = false;
    setSearchdata([]);
  }
  // async function handlesave(e) {
  //   e.preventDefault();

  //   if (imageUpload22.length === 0 && status === undefined) {
  //     alert('set status');
  //   } else if (imageUpload22.length === 0) {
  //     alert('set image ');
  //   } else {
  //     try {
  //       setLoaderstatus(true);
  //       const imagelinks = [];
  //       for await (const file of imageUpload22) {
  //         const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
  //         const storageRef = ref(storage, `/products/${filename}`);
  //         const upload = await uploadBytes(storageRef, file);
  //         const imageUrl = await getDownloadURL(storageRef);
  //         imagelinks.push(imageUrl);
  //       }

  //       const docRef = await addDoc(collection(db, 'products'), {
  //         name: name,
  //         shortDescription: shortDes,
  //         longDescription: longDes,
  //         originalPrice: originalPrice,
  //         discountType: discountType,
  //         discount: discount,
  //         deliveryCharges: deliveryCharges,
  //         status: status,
  //         sku: sku,
  //         totalStock: totalStock,
  //         categories: catval,
  //         productImages: imagelinks,
  //       });
  //       setSearchdata([]);
  //       setLoaderstatus(false);
  //       toast.success('Product added Successfully !', {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       handleReset();
  //     } catch (e) {
  //       toast.error(e, {
  //         position: toast.POSITION.TOP_RIGHT,
  //       });
  //       console.error('Error adding document: ', e);
  //     }
  //   }
  // }

  // image upload section

  function handelUpload22(event) {
    const selectedImages = Array.from(event.target.files);
    setImageUpload22([...imageUpload22, ...selectedImages]);
  }

  function handleDelete22(index) {
    const updatedImages = [...imageUpload22];
    updatedImages.splice(index, 1);
    setImageUpload22(updatedImages);
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
        // console.log(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  function handlesave(e) {
    e.preventDefault();
    console.log(
      name,
      shortDes,
      longDes,
      discountType,
      originalPrice,
      discount,
      imageUpload22,
      status,
      categories,
      totalStock,
      sku,
      delivery,
      varientvalue
    );
  }
  function handleSearch(e) {
    const mylist = [];
    function search(nameKey, myArray) {
      if (e.target.value.length === 0) {
        setSearchdata(null);
      } else {
        for (let i = 0; i < myArray.length; i++) {
          if (String(myArray[i].title).includes(nameKey)) {
            mylist.push(myArray[i]);
          }
        }
      }
    }

    search(e.target.value, data);
    setSearchdata(mylist);
  }
  //   if (loaderstatus) {
  //     return (
  //       <>
  //         <div className="loader">
  //           <h3 className="heading">Uploading Data... Please Wait</h3>
  //         </div>
  //       </>
  //     );
  // } else {

  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body pt-3">
        <form onSubmit={handlesave}>
          <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500  mb-0 black fs-lg">New Product</h1>
            </div>
            <div className="d-flex align-itmes-center gap-3">
              <button className="reset_border">
                <button onClick={handleReset} className="fs-sm reset_btn  border-0 fw-400 ">
                  Reset
                </button>
              </button>
              <button
                className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                type="submit">
                <img src={saveicon} alt="saveicon" />
                Save
              </button>
            </div>
          </div>
          <Row className="mt-3">
            <Col xxl={8}>
              {/* Basic Information */}
              <div className="  ">
                <div>
                  {/* Ist-box  */}
                  <div class="product_shadow bg_white p-3  ">
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
                    <label htmlFor="short" className="fs-xs fw-400 mt-3 black">
                      Short Description
                    </label>{' '}
                    <br />
                    <input
                      type="text"
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="Enter short description"
                      id="short"
                      value={shortDes}
                      onChange={(e) => setShortDes(e.target.value)}
                    />{' '}
                    <br />
                    {/* 3rd input */}
                    <label htmlFor="des" className="fs-xs fw-400 mt-3 black">
                      Description
                    </label>{' '}
                    <br />
                    <textarea
                      id="des"
                      className="mt-2 product_input resize_none fade_grey fw-400"
                      cols="30"
                      rows="5"
                      placeholder="Enter product name"
                      value={longDes}
                      onChange={(e) => setLongDes(e.target.value)}></textarea>
                  </div>
                  <br />
                  {/* [Pricing] */}
                  <div className="product_shadow bg_white p-3 mt-3">
                    <div className=" d-flex align-items-center w-75 justify-content-between pb-3 mb-1">
                      <h2 className="fw-400 fs-2sm black mb-0">Have More Varients?</h2>
                      <div className="d-flex align-items-center">
                        <label className="pe-3 me-1" for="varient_yes">
                          Yes
                        </label>
                        <input
                          onChange={() => setVarient(true)}
                          className="fs-xs fw-400 black varient_btn"
                          type="radio"
                          id="varient_yes"
                          checked={varient === true}
                        />
                      </div>
                      <div className="d-flex align-items-center">
                        <label className="pe-3 me-1" for="varient_no">
                          No
                        </label>
                        <input
                          onChange={() => setVarient(false)}
                          className="fs-xs fw-400 black varient_btn"
                          type="radio"
                          id="varient_no"
                          checked={varient === false}
                        />
                      </div>
                    </div>
                    {varient == true ? (
                      <div className="text-end">
                        <button className="fs-2sm fw-400 color_green add_varient_btn">
                          +Add Varient
                        </button>
                      </div>
                    ) : (
                      <p></p>
                    )}
                    {varient == true ? (
                      <div className="varient_form_border">
                        <div className=" d-flex align-items-center justify-content-between">
                          <input
                            onChange={(e) => setVarientvalue(e.target.value)}
                            className="varient_value fs-2sm fw-400 color_red"
                            type="text"
                            value={varientvalue}
                          />
                          <img src={deleteicon} alt="" />
                        </div>
                        <div className="d-flex flex-column flex-sm-row gap-3">
                          {/* ist input */}
                          <div className="width_33 w_xsm_100">
                            <label htmlFor="origi" className="fs-xs fw-400 mt-3 black">
                              Original Price
                            </label>
                            <input
                              type="number"
                              className="mt-2 product_input fade_grey fw-400"
                              placeholder="₹ 0.00"
                              id="origi"
                              value={originalPrice}
                              onChange={(e) => setOriginalPrice(e.target.value)}
                            />{' '}
                          </div>
                          {/* 2nd input */}
                          <div className="width_33 w_xsm_100">
                            <label htmlFor="Discount" className="fs-xs fw-400 mt-3 black">
                              Discount Type
                            </label>{' '}
                            <select
                              className="mt-2 product_input  fade_grey fw-400"
                              id="Discount"
                              value={discountType}
                              onChange={(e) => {
                                setDiscountType(e.target.value);
                                setDiscount(0);
                              }}>
                              <option
                                className="mt-2 product_input fade_grey fw-400"
                                value="Amount">
                                Amount
                              </option>
                              <option
                                className="mt-2 product_input fade_grey fw-400"
                                value="Percentage">
                                Percentage
                              </option>
                            </select>
                          </div>
                          {/* 3rd input */}
                          <div className="width_33 w_xsm_100">
                            <label htmlFor="ddisc" className="fs-xs fw-400 mt-3 black">
                              Discount
                            </label>
                            <input
                              type="number"
                              className="mt-2 product_input fade_grey fw-400"
                              placeholder={discountType !== 'Percentage' ? '₹ 0.00' : '%'}
                              id="ddisc"
                              value={discount}
                              onChange={(e) => {
                                if (discountType == 'Percentage') {
                                  if (e.target.value < 101 && e.target.value >= 0) {
                                    setDiscount(e.target.value);
                                  }
                                } else {
                                  setDiscount(e.target.value);
                                }
                              }}
                            />{' '}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="fw-400 fs-2sm black mb-0">Pricing</h2>
                        <div className="d-flex flex-column flex-sm-row gap-3">
                          {/* ist input */}
                          <div className="width_33 w_xsm_100">
                            <label htmlFor="origi" className="fs-xs fw-400 mt-3 black">
                              Original Price
                            </label>
                            <input
                              type="number"
                              className="mt-2 product_input fade_grey fw-400"
                              placeholder="₹ 0.00"
                              id="origi"
                              value={originalPrice}
                              onChange={(e) => setOriginalPrice(e.target.value)}
                            />{' '}
                          </div>
                          {/* 2nd input */}
                          <div className="width_33 w_xsm_100">
                            <label htmlFor="Discount" className="fs-xs fw-400 mt-3 black">
                              Discount Type
                            </label>{' '}
                            <select
                              className="mt-2 product_input  fade_grey fw-400"
                              id="Discount"
                              value={discountType}
                              onChange={(e) => {
                                setDiscountType(e.target.value);
                                setDiscount(0);
                              }}>
                              <option
                                className="mt-2 product_input fade_grey fw-400"
                                value="Amount">
                                Amount
                              </option>
                              <option
                                className="mt-2 product_input fade_grey fw-400"
                                value="Percentage">
                                Percentage
                              </option>
                            </select>
                          </div>
                          {/* 3rd input */}
                          <div className="width_33 w_xsm_100">
                            <label htmlFor="ddisc" className="fs-xs fw-400 mt-3 black">
                              Discount
                            </label>
                            <input
                              type="number"
                              className="mt-2 product_input fade_grey fw-400"
                              placeholder={discountType !== 'Percentage' ? '₹ 0.00' : '%'}
                              id="ddisc"
                              value={discount}
                              onChange={(e) => {
                                if (discountType == 'Percentage') {
                                  if (e.target.value < 101 && e.target.value >= 0) {
                                    setDiscount(e.target.value);
                                  }
                                } else {
                                  setDiscount(e.target.value);
                                }
                              }}
                            />{' '}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* images  */}
                  <div className="product_shadow bg_white p-3 mt-3">
                    <h2 className="fw-400 fs-2sm black mb-0">Images</h2>
                    <div className="d-flex flex-wrap gap-4 mt-3 align-items-center">
                      <input
                        type="file"
                        id="file22"
                        hidden
                        accept="/*"
                        multiple
                        onChange={handelUpload22}
                      />
                      {imageUpload22.map((img, index) => (
                        <div className=" d-flex flex-wrap">
                          <div className="position-relative " key={index}>
                            <img
                              className="mobile_image object-fit-cover"
                              src={URL.createObjectURL(img)}
                              alt=""
                            />
                            <img
                              className="position-absolute top-0 end-0 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                              onClick={() => handleDelete22(index)}
                            />
                          </div>
                        </div>
                      ))}
                      <label
                        htmlFor="file22"
                        className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col xxl={4}>
              {/* Status */}

              <div className="product_shadow bg_white p-3 mt-3 mt-xxl-0">
                <div className="product_borderbottom">
                  <h2 className="fw-400 fs-2sm black mb-0">Status</h2>
                  <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                    <label className="check fw-400 fs-sm black mb-0">
                      Published
                      <input
                        onChange={() => setStatus('published')}
                        type="radio"
                        checked={status === 'published'}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 pb-3">
                    <label className="check fw-400 fs-sm black mb-0">
                      Hidden
                      <input
                        onChange={() => setStatus('hidden')}
                        type="radio"
                        checked={status === 'hidden'}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
                <div>
                  <h2 className="fw-400 fs-2sm black mb-0 pt-3">Free Delivery</h2>
                  <div className="d-flex align-items-center">
                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 w-50">
                      <label className="check fw-400 fs-sm black mb-0">
                        Yes
                        <input
                          onChange={() => setDelivery('yes')}
                          type="radio"
                          checked={delivery === 'yes'}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 w-50">
                      <label className="check fw-400 fs-sm black mb-0">
                        No
                        <input
                          onChange={() => setDelivery('no')}
                          type="radio"
                          checked={delivery === 'no'}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* invertory */}
              <div className="mt-4 product_shadow bg_white p-3">
                <h2 className="fw-400 fs-2sm black mb-0">Inventory</h2>
                {/* ist input */}
                <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                  SKU
                </label>
                <br />
                <input
                  type="text"
                  className="mt-2 product_input fade_grey fw-400"
                  placeholder="6HK3I5"
                  value={sku}
                  id="sku"
                  onChange={(e) => setSku(e.target.value)}
                />{' '}
                <br />
                {/* 2nd input */}
                <label htmlFor="total" className="fs-xs fw-400 mt-3 black">
                  Total Stock
                </label>{' '}
                <br />
                <div className="product_input d-flex align-items-center justify-content-between mt-2">
                  <input
                    type="text"
                    className="fade_grey fw-400 border-0 outline_none"
                    placeholder="50"
                    id="total"
                    value={totalStock}
                    onChange={(e) => setTotalStock(e.target.value)}
                  />{' '}
                  <img src={addIcon} alt="addIcon" />
                </div>
                <br />
              </div>
              {/* Categories */}
              <div className="mt-4 product_shadow bg_white p-3">
                <labl className="fw-400 fs-2sm black mb-0">Categories</labl>
                {/* <input
                      type="text"
                      className="mt-3  fade_grey fw-400"
                      placeholder="search for category"
                      onChange={handleSearch}
                    /> */}
                <select
                  onChange={(e) => setCategories(e.target.value)}
                  value={categories}
                  className="mt-3 product_input  fade_grey fw-400">
                  <option disabled className="mt-2 product_input fade_grey fw-400" value="">
                    search for category
                  </option>
                  <option className="mt-2 product_input fade_grey fw-400" value="Washing Machine">
                    Washing Machine
                  </option>
                  <option className="mt-2 product_input fade_grey fw-400" value="LED TV">
                    LED TV
                  </option>
                  <option className="mt-2 product_input fade_grey fw-400" value="Mobile Phone">
                    Mobile Phone
                  </option>
                  <option className="mt-2 product_input fade_grey fw-400" value="Men Shoe">
                    Men Shoe
                  </option>
                </select>
              </div>
            </Col>
          </Row>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProduct;
// <div className=" d-flex flex-column align-items-start">
//   <button className="text-end">+Add Varient</button>
//   <input
//     onChange={(e) => setVarientvalue(e.target.value)}
//     className="varient_value fs-2sm fw-400 color_red"
//     type="text"
//     value={varientvalue}
//   />
// </div>;
