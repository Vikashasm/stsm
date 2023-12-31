import React, { useState, useEffect } from 'react';
import saveicon from '../../Images/svgs/saveicon.svg';
import savegreenicon from '../../Images/svgs/save_green_icon.svg';
import SearchIcon from '../../Images/svgs/search.svg';
import whiteSaveicon from '../../Images/svgs/white_saveicon.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import closeicon from '../../Images/svgs/closeicon.svg';
import addIcon from '../../Images/svgs/addicon.svg';
import { Col, Row } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Dropdown from 'react-bootstrap/Dropdown';
import { storage } from '../../firebase';
import { useRef } from 'react';
import { useProductsContext } from '../../context/productgetter';
import { useSubCategories } from '../../context/categoriesGetter';

const AddProduct = () => {
  // const { data } = useProductsContext()
  const [name, setName] = useState('');
  const [shortDes, setShortDes] = useState('');
  const [longDes, setLongDes] = useState('');
  const [varient, setVarient] = useState(false);

  // context
  const { addData } = useProductsContext();
  const { data } = useSubCategories();

  const [status, setStatus] = useState('published');
  const [Freedelivery, setFreeDelivery] = useState(true);
  const [sku, setSku] = useState('');
  const [totalStock, setTotalStock] = useState('');
  const [stockPrice, setStockPrice] = useState('');
  const [categories, setCategories] = useState('');
  const [imageUpload22, setImageUpload22] = useState([]);
  // const [categoriesdata, setSubcategoriesData] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [stockpopup, setStockpopup] = useState(false);

  //  search functionaltiy in categories and selected categories
  const [searchvalue, setSearchvalue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelectCategory = (category) => {
    setSearchvalue('');
    setSelectedCategory(category);
  };

  const [variants, setVariants] = useState([]);
  const [discount, setDiscount] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [VarintName, setVariantsNAME] = useState('');
  const [discountType, setDiscountType] = useState('Amount');
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  function HandleAddVarients() {
    setVariants((prevVariants) => [
      ...prevVariants,
      {
        VarientName: VarintName,
        originalPrice: originalPrice,
        discountType: discountType,
        discount: discount,
      },
    ]);
    // Reset individual variant properties
    setOriginalPrice(0);
    setDiscountType('Amount');
    setDiscount(0);
    setVariantsNAME('');
  }

  // stock popup save functionality

  // get total amount functionality
  function handleTotalQunatity(e) {
    let value = e.target.value;
    return setTotalStock(value);
  }

  function handleSetTotalPrice(e) {
    let value = e.target.value;
    return setStockPrice(value);
  }

  function HandleStockPopUpSave() {
    setStockpopup(false);
  }

  const pubref = useRef();
  const hidref = useRef();

  function handleReset() {
    setName();
    setShortDes();
    setLongDes();
    setOriginalPrice(0);
    setDiscountType('Amount');
    setDiscount(0);
    setVariants([]);
    setCategories();
    setStatus('published');
    setFreeDelivery(true);
    setSku();
    setTotalStock();
    setImageUpload22([]);
    setSelectedCategory(null);
    setStockPrice('');

    pubref.current.checked = false;
    hidref.current.checked = false;
    // setSearchdata([]);
  }
  async function handlesave(e) {
    e.preventDefault();

    if (imageUpload22.length === 0 && status === undefined) {
      alert('set status');
    } else if (imageUpload22.length === 0) {
      alert('set image ');
    } else if (!name || !shortDes || !totalStock) {
      alert('Please enter name  or ShortDescription or TotalStock ');
    } else if (!selectedCategory) {
      alert('please select category ');
    } else {
      try {
        setLoaderstatus(true);
        const imagelinks = [];
        for await (const file of imageUpload22) {
          const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
          const storageRef = ref(storage, `/products/${filename}`);
          const upload = await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          imagelinks.push(imageUrl);
          
        }

        const docRef = await addDoc(collection(db, 'products'), {
          name: name,
          shortDescription: shortDes,
          longDescription: longDes,
          status: status,
          sku: sku,
          Freedelivery: Freedelivery,
          totalStock: totalStock,
          categories: {
            parent_id: selectedCategory.cat_ID,
            id: selectedCategory.id,
            name: selectedCategory.title,
          },
          productImages: imagelinks,
          isMultipleVariant: varient === true,
          ...(varient === false
            ? {
                varients: [
                  {
                    originalPrice: originalPrice,
                    discountType: discountType,
                    discount: deliveryCharges,
                  },
                ],
              }
            : {
                varients: variants,
              }), // Include the actual list of variants if varient is true
        });
        setSearchdata([]);
        setLoaderstatus(false);
        toast.success('Product added Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleReset();
        addData(docRef);
      } catch (e) {
        toast.error(e, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error('Error adding document: ', e);
      }
    }
  }

  // image upload section

  function handelUploadImages(event) {
    const selectedImages = Array.from(event.target.files);

    selectedImages.forEach((selectedFile) => {
      const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp'];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        toast.error('Please select a valid image file within 1.5 MB.')
      } else {
        setImageUpload22((prevImages) => [...prevImages, selectedFile]);
      }
    });
  }

  function handleDeleteImages(index) {
    const updatedImages = [...imageUpload22];
    updatedImages.splice(index, 1);
    setImageUpload22(updatedImages);
  }

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
                        Name <span className="red ms-1 fs-sm">*</span>
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="Enter product name"
                        id="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />{' '}
                      <br />
                      {/* 2nd input */}
                      <label htmlFor="short" className="fs-xs fw-400 mt-3 black">
                        Short Description <span className="red ms-1 fs-sm">*</span>
                      </label>{' '}
                      <br />
                      <input
                        type="text"
                        required
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
                    <div className="product_shadow bg_white p-3">
                      <div className=" d-flex align-items-center w-75 justify-content-between pb-3 mb-1">
                        <h2 className="fw-400 fs-2sm black mb-0">
                          Have More Varients? <span className="red ms-1 fs-sm">*</span>
                        </h2>
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
                      {varient === true ? (
                        <div className="text-end">
                          <button
                            onClick={HandleAddVarients}
                            type="button"
                            className="fs-2sm fw-400 color_green add_varient_btn">
                            +Add Varient
                          </button>
                        </div>
                      ) : null}
                      {varient === true ? (
                        variants.map((variant, index) => (
                          <div key={index} className="varient_form_border">
                            <div className="d-flex align-items-center justify-content-between">
                              <input
                                required
                                className="varient_value fs-2sm fw-400 color_red"
                                placeholder="Enter Varient Name"
                                type="text"
                                value={variant.VarintName}
                                onChange={(e) =>
                                  setVariants((prevVariants) =>
                                    prevVariants.map((v, i) =>
                                      i === index ? { ...v, VarientName: e.target.value } : v
                                    )
                                  )
                                }
                              />
                              <img src={deleteicon} alt="deleteicon" />
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-3">
                              <div className="width_33 w_xsm_100">
                                <label htmlFor="origi" className="fs-xs fw-400 mt-3 black">
                                  Original Price
                                </label>
                                <input
                                  required
                                  type="number"
                                  className="mt-2 product_input fade_grey fw-400"
                                  placeholder="₹ 0.00"
                                  id="origi"
                                  value={variant.originalPrice}
                                  onChange={(e) =>
                                    setVariants((prevVariants) =>
                                      prevVariants.map((v, i) =>
                                        i === index ? { ...v, originalPrice: e.target.value } : v
                                      )
                                    )
                                  }
                                />
                              </div>
                              <div className="width_33 w_xsm_100">
                                <label htmlFor="Discount" className="fs-xs fw-400 mt-3 black">
                                  Discount Type
                                </label>{' '}
                                <select
                                  className="mt-2 product_input fade_grey fw-400"
                                  id="Discount"
                                  value={variant.discountType}
                                  onChange={(e) => {
                                    const selectedDiscountType = e.target.value;
                                    setVariants((prevVariants) =>
                                      prevVariants.map((v, i) =>
                                        i === index
                                          ? {
                                              ...v,
                                              discountType: selectedDiscountType,
                                              // Reset discount value when changing the discount type to "Amount"
                                              discount:
                                                selectedDiscountType === 'Amount' ? 0 : v.discount,
                                            }
                                          : v
                                      )
                                    );
                                  }}>
                                  <option value="Amount">Amount</option>
                                  <option value="Percentage">Percentage</option>
                                </select>
                              </div>
                              <div className="width_33 w_xsm_100">
                                <label htmlFor="ddisc" className="fs-xs fw-400 mt-3 black">
                                  Discount
                                </label>
                                <input
                                  required
                                  type="number"
                                  className="mt-2 product_input fade_grey fw-400"
                                  placeholder={
                                    variant.discountType !== 'Percentage' ? '₹ 0.00' : '%'
                                  }
                                  id="ddisc"
                                  value={variant.discount}
                                  onChange={(e) =>
                                    setVariants((prevVariants) =>
                                      prevVariants.map((v, i) =>
                                        i === index ? { ...v, discount: e.target.value } : v
                                      )
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))
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
                                required
                                type="number"
                                className="mt-2 product_input fade_grey fw-400"
                                placeholder="₹ 0.00"
                                id="origi"
                                value={originalPrice}
                                onChange={(e) => setOriginalPrice(e.target.value)}
                              />
                            </div>
                            {/* 2nd input */}
                            <div className="width_33 w_xsm_100">
                              <label htmlFor="Discount" className="fs-xs fw-400 mt-3 black">
                                Discount Type
                              </label>
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
                                required
                                type="number"
                                className="mt-2 product_input fade_grey fw-400"
                                placeholder={discountType !== 'Percentage' ? '₹ 0.00' : '%'}
                                id="ddisc"
                                value={discount}
                                onChange={(e) => {
                                  if (discountType === 'Percentage') {
                                    if (e.target.value < 101 && e.target.value >= 0) {
                                      setDiscount(e.target.value);
                                    }
                                  } else {
                                    setDiscount(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* images  */}
                    <div className="product_shadow bg_white p-3 mt-4">
                      <h2 className="fw-400 fs-2sm black mb-0">
                        Images <span className="red ms-1 fs-sm">*</span>
                      </h2>
                      <div className="d-flex flex-wrap gap-4 mt-3 align-items-center">
                        <input
                          required
                          type="file"
                          id="file22"
                          hidden
                          accept="/*"
                          multiple
                          onChange={handelUploadImages}
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
                                className="position-absolute top-0 end-0 cursor_pointer p-1"
                                src={deleteicon}
                                alt="deleteicon"
                                onClick={() => handleDeleteImages(index)}
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
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Status <span className="red ms-1 fs-sm">*</span>
                    </h2>
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
                            onChange={() => setFreeDelivery(true)}
                            type="radio"
                            checked={Freedelivery === true}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3 w-50">
                        <label className="check fw-400 fs-sm black mb-0">
                          No
                          <input
                            onChange={() => setFreeDelivery(false)}
                            type="radio"
                            checked={Freedelivery === false}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* invertory */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <h2 className="fw-400 fs-2sm black mb-0">
                    Inventory <span className="red ms-1 fs-sm">*</span>
                  </h2>
                  {/* ist input */}
                  <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                    SKU
                  </label>
                  <br />
                  <div className="d-flex align-items-center justify-content-between product_input mt-2">
                    <input
                      required
                      type="text"
                      className="fade_grey fw-400 w-100 border-0 bg-white"
                      placeholder="6HK3I5"
                      value={sku}
                      id="sku"
                      onChange={(e) => setSku(e.target.value)}
                    />
                    <button
                      type="button"
                      className="white_space_nowrap border-0 bg-white color_blue">
                      Generate SKU
                    </button>
                  </div>
                  {/* 2nd input */}
                  <label htmlFor="total" className="fs-xs fw-400 mt-3 black">
                    Total Stock{' '}
                    <span className="fade_grey ms-2">{`Purchase Value : ₹${stockPrice}`}</span>
                  </label>{' '}
                  <br />
                  <div className="position-relative">
                    <div className="product_input d-flex align-items-center justify-content-between mt-2">
                      <input
                        required
                        type="text"
                        className="black fw-400 border-0 outline_none bg-white"
                        placeholder="50"
                        disabled
                        id="total"
                        value={totalStock}
                      />{' '}
                      <img onClick={() => setStockpopup(true)} src={addIcon} alt="addIcon" />
                    </div>
                    {stockpopup === true ? (
                      <div className="stock_popup">
                        <div onClick={() => setStockpopup(false)} className="text-end">
                          <img src={closeicon} alt="closeicon" />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">Date of Purchase</label>
                          <input className="product_input fade_grey fw-400 mt-2" type="date" />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">Total Quantity</label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="number"
                            placeholder="0.00"
                            value={totalStock}
                            onChange={handleTotalQunatity}
                          />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">Total Purchase Price</label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="number"
                            placeholder="₹ 0.00"
                            value={stockPrice}
                            onChange={handleSetTotalPrice}
                          />
                        </div>
                        <button
                          className="stock_save_btn d-flex align-items-center"
                          onClick={HandleStockPopUpSave}>
                          <img src={whiteSaveicon} alt="whiteSaveicon" />
                          <p className="fs-sm fw-400 white ms-2 mb-0">Save</p>
                        </button>
                      </div>
                    ) : null}
                    <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                      Stock Alert Count
                    </label>
                    <br />
                    <input
                      required
                      type="text"
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="2"
                    />{' '}
                  </div>
                  <br />
                </div>
                {/* Categories */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <lable className="fw-400 fs-2sm black mb-0">
                    Categories <span className="red ms-1 fs-sm">*</span>
                  </lable>
                  <Dropdown className="category_dropdown">
                    <Dropdown.Toggle id="dropdown-basic" className="dropdown_input_btn">
                      <div className="product_input">
                        <p className="fade_grey fw-400 w-100 mb-0 text-start" required>
                          {selectedCategory ? selectedCategory.title : 'Select Category'}
                        </p>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center product_input position-sticky top-0">
                          <img src={SearchIcon} alt="SearchIcon" />
                          <input
                            onChange={(e) => setSearchvalue(e.target.value)}
                            placeholder="search for category"
                            className="fade_grey fw-400 border-0 outline_none ms-2 w-100"
                            type="text"
                          />
                        </div>
                        <div>
                          {data
                            .filter((items) => {
                              return searchvalue.toLowerCase() === ''
                                ? items
                                : items.title.toLowerCase().includes(searchvalue);
                            })
                            .map((category) => (
                              <Dropdown.Item>
                                <div
                                  className={`d-flex justify-content-between ${
                                    selectedCategory && selectedCategory.id === category.id
                                      ? 'selected'
                                      : ''
                                  }`}
                                  onClick={() => handleSelectCategory(category)}>
                                  <p className="fs-xs fw-400 black mb-0">{category.title}</p>
                                  {selectedCategory && selectedCategory.id === category.id && (
                                    <img src={savegreenicon} alt="savegreenicon" />
                                  )}
                                </div>
                              </Dropdown.Item>
                            ))}
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </form>
        </div>

        <ToastContainer />
      </div>
    );
  }
};

export default AddProduct;
