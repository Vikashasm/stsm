import React, { useState, useEffect, useContext } from 'react';
import saveicon from '../../Images/svgs/saveicon.svg';
import savegreenicon from '../../Images/svgs/save_green_icon.svg';
import SearchIcon from '../../Images/svgs/search.svg';
import whiteSaveicon from '../../Images/svgs/white_saveicon.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import deleteiconWithBg from '../../Images/svgs/delete-icon-with-bg.svg';
import closeicon from '../../Images/svgs/closeicon.svg';
import addIcon from '../../Images/svgs/addicon.svg';
import checkGreen from '../../Images/svgs/check-green-btn.svg';
import closeRed from '../../Images/svgs/close-red-icon.svg';
import dropdownImg from '../../Images/svgs/dropdown_icon.svg';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { Col, DropdownButton, Row } from 'react-bootstrap';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Dropdown from 'react-bootstrap/Dropdown';
import { storage } from '../../firebase';
import { useRef } from 'react';
import { useProductsContext } from '../../context/productgetter';
import { useSubCategories } from '../../context/categoriesGetter';
import { useBrandcontext } from '../../context/BrandsContext';
import { UseServiceContext } from '../../context/ServiceAreasGetter';
import { useParams, useNavigate } from 'react-router-dom';
import { increment } from 'firebase/firestore';
import Loader from '../Loader';
import { Units } from '../../Common/Helper';

const AddProduct = () => {
  const navigate = useNavigate();

  const { productData, updateProductData } = useProductsContext();
  const { allBrands } = useBrandcontext()
  const { ServiceData } = UseServiceContext()


  const skuList = productData.map(product => product.sku);
  // console.log("sku list is ", skuList)



  const productId = useParams();

  let ProductsID = productId.id;
  const [name, setName] = useState('');
  const [shortDes, setShortDes] = useState('');
  const [longDes, setLongDes] = useState('');
  const [isvarient, setisVarient] = useState(false);
  const [colorVar, setColorVar] = useState(false);
  const [color, setColor] = useState('');
  const [storeColors, setStoreColors] = useState([]);
  const [colorInput, setColorInput] = useState(false);
  // context
  const { addData } = useProductsContext();
  const { data } = useSubCategories();
  // console.log(color);
  const [status, setStatus] = useState('published');
  const [sku, setSku] = useState('');
  const [totalStock, setTotalStock] = useState('');
  const [StockCount, setStockCount] = useState('');
  const [stockPrice, setStockPrice] = useState('');
  const [categories, setCategories] = useState('');
  const [imageUpload22, setImageUpload22] = useState([]);
  // const [categoriesdata, setSubcategoriesData] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [stockpopup, setStockpopup] = useState(false);
  const [unitType, setUnitType] = useState('KG');
  const [DeliveryCharge, setDeliveryCharges] = useState();
  const [ServiceCharge, setServiceCharge] = useState();
  const [SalesmanCommission, setSalesmanComssion] = useState();

  //  search functionaltiy in categories and selected categories
  const [searchvalue, setSearchvalue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [previousCategoryId, setPreviousCategoryId] = useState(null);
  const [previousCategoryname, setpreviousCategoryname] = useState(null);
  const [previousCategoryParentId, setpreviousCategoryParentId] = useState(null);
  const [brandid, setbrandid] = useState(null)
  const [selectBrand, setSelectBrand] = useState(null)
  const [previousbrandId, setPreviousbrandId] = useState(null)
  const [previousbrandName, setPreviousbrandName] = useState(null)
  const [previousbrandImage, setPreviousbrandImage] = useState(null)
  const handleSelectCategory = (category) => {
    setSearchvalue('');
    setSelectedCategory(category);
    setSelectedCategoryId(category.id);
  };

  const handleSelectBrand = (brand) => {
    setSelectBrand(brand)
    setbrandid(brand.id)
  }

  const [addMoreArea, setAddMoreArea] = useState([
    {
      pincode: '',
      area_name: '',
      terretory: []
    }
  ]);
  const [variants, setVariants] = useState([]);
  const [discount, setDiscount] = useState(null);
  const [originalPrice, setOriginalPrice] = useState('');
  const [VarintName, setVariantsNAME] = useState('');
  const [Tax, setTax] = useState(null);
  const [discountType, setDiscountType] = useState('Amount');


  function HandleAddVarients() {
    setVariants((prevVariants) => [
      ...prevVariants,
      {
        VarientName: VarintName,
        originalPrice: originalPrice,
        discountType: discountType,
        discount: discount,
        unitType,
      },
    ]);
    // Reset individual variant properties
    setOriginalPrice(0);
    setDiscountType('Amount');
    setDiscount(0);
    setVariantsNAME('');
  }

  function handleDeleteVariant(index) {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
  }

  const [selectarea, setSelectArea] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(Array(addMoreArea.length).fill(false));
  const dropdownRef = useRef(null);
  // const [areas, setAreas] = useState([]);

  const handleCheckboxChange = (e) => {
    let isChecked = e.target.checked;
    let value = e.target.value;
    if (isChecked) {
      setSelectArea([...selectarea, value]);
    } else {
      setSelectArea((prevState) => prevState.filter((area) => area !== value));
    }
  };


  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => {
      if (Array.isArray(prevState)) {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      } else {
        return !prevState;
      }
    });
  };

  const closeDropdown = (index) => {
    setDropdownOpen((prevState) => {
      if (Array.isArray(prevState)) {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      } else {
        return false;
      }
    });
  };

  const handleProductInputClick = (index) => {
    if (dropdownOpen[index]) {
      closeDropdown(index);
    } else {
      // Close other dropdowns before opening the clicked one
      setDropdownOpen(Array(addMoreArea.length).fill(false));
      toggleDropdown(index);
    }
  };


  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);








  function handlAddMoreAreas() {
    setAddMoreArea((prevareas) => [
      ...prevareas,
      {
        pincode: '',
        area_name: '',
        terretory: []
      }
    ])

  }


  function handleDeleteArea(index) {
    // setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
    setAddMoreArea((Prevarareas) => Prevarareas.filter((_, i) => i !== index))
  }


  function handlePincodeChange(index, newPincode) {
    const filterData = ServiceData.filter((datas) => datas.PostalCode === newPincode);
    const areaName = filterData[0]?.AreaName || '';
    setAddMoreArea((prevVariants) =>
      prevVariants.map((v, i) =>
        i === index ? { ...v, pincode: newPincode, area_name: areaName } : v
      )
    );
  }

  function handleSelectedAreasChange(index, newSelectedAreas) {
    setAddMoreArea((prevVariants) =>
      prevVariants.map((v, i) =>
        i === index ? { ...v, terretory: newSelectedAreas } : v
      )
    );

  }



  // const allPincodes = addMoreArea.map(area => area.pincode);

  // const filteredServices = allPincodes.reduce((acc, pincode) => {
  //   const servicesForPincode = ServiceData.filter(service => service.PostalCode === pincode);
  //   return [...acc, ...servicesForPincode];
  // }, []);

  // console.log("filtered service is ", filteredServices);


  // useEffect(() => {
  //   const latestPincode = addMoreArea[addMoreArea.length - 1]?.pincode;
  //   if (latestPincode) {
  //     // Update areas based on the latest added pincode
  //     const filteredServices = ServiceData.filter(service => service.PostalCode === latestPincode);
  //     const newAreas = filteredServices.map(service => service.AreaList);
  //     setAreas(newAreas);
  //   } else {
  //     setAreas([]); // Reset areas if no pincode is available
  //   }
  // }, [addMoreArea, ServiceData]);





  // stock popup save functionality

  // useEffect(() => {
  //   console.log("add more areas is", addMoreArea)
  // }, [addMoreArea])







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

  const convertDeltaToHtml = (deltaops) => {
    const converter = new QuillDeltaToHtmlConverter(deltaops, {});
    return converter.convert();
  };

  function handleDescriptionChange(content, delta, source, editor) {
    const deltaOps = editor.getContents().ops;
    const deltaHtml = convertDeltaToHtml(deltaOps);
    setLongDes(deltaHtml);
  }

  // const pubref = useRef();
  // const hidref = useRef();

  function handleReset() {
    setName('');
    setShortDes('');
    setLongDes('');
    setOriginalPrice(0);
    setDiscountType('Amount');
    setDiscount(null);
    setVariants([]);
    setCategories();
    setStatus('published');
    setSku('');
    setTotalStock('');
    setImageUpload22([]);
    setSelectedCategory(null);
    setStockPrice('');
    setDeliveryCharges(0);
    setSalesmanComssion(0);
    setServiceCharge(0);
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
          totalStock: totalStock,
          stockAlert: StockCount,
          categories: {
            parent_id: selectedCategory.cat_ID,
            id: selectedCategory.id,
            name: selectedCategory.title,
          },
          brand: {
            id: selectBrand.id,
            name: selectBrand.name,
            image: selectBrand.image
          },
          productImages: imagelinks,
          created_at: Date.now(),
          updated_at: Date.now(),
          SalesmanCommission,
          ServiceCharge,
          DeliveryCharge,
          colors: storeColors,
          Tax,
          isMultipleVariant: isvarient === true,
          ...(isvarient === false
            ? {
              varients: [
                {
                  VarientName: VarintName,
                  originalPrice: originalPrice,
                  discountType: discountType,
                  discount: discount,
                  unitType,
                },
              ],
            }
            : {
              varients: variants,
            }), // Include the actual list of variants if varient is true
          serviceable_areas: addMoreArea,
        });
        setSearchdata([]);
        setLoaderstatus(false);

        await updateDoc(doc(db, 'sub_categories', selectedCategoryId), {
          noOfProducts: increment(1),
        });

        await updateDoc(doc(db, 'Brands', brandid), {
          totalProducts: increment(1)
        })
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
        toast.error('Please select a valid image file within 1.5 MB.');
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

  // Edit Product
  let filterdata;
  if (productId.id) {
    filterdata = productData.filter((items) => items.id === productId.id);
  }
  useEffect(() => {
    if (filterdata) {
      filterdata.map((items) => {
        if (items.name) setName(items.name);
        if (items.shortDescription) setShortDes(items.shortDescription);
        if (items.longDescription) setLongDes(items.longDescription);
        if (items.status) setStatus(items.status);
        if (items.totalStock) setTotalStock(items.totalStock);
        if (items.sku) setSku(items.sku);
        if (items.isMultipleVariant) setisVarient(items.isMultipleVariant);
        if (items.varients && items.varients.VarientName) setVariantsNAME(items.varients.VarientName);
        if (items.categories && items.categories.name) setSelectedCategory(items.categories.name);
        if (items.productImages) setImageUpload22(items.productImages);
        if (items.DeliveryCharge) setDeliveryCharges(items.DeliveryCharge);
        if (items.ServiceCharge) setServiceCharge(items.ServiceCharge);
        if (items.SalesmanCommission) setSalesmanComssion(items.SalesmanCommission);
        if (items.stockAlert) setStockCount(items.stockAlert);
        if (items.colors) setStoreColors(items.colors);
        if (items.categories && items.categories.id) setPreviousCategoryId(items.categories.id);
        if (items.categories && items.categories.parent_id) setpreviousCategoryParentId(items.categories.parent_id);
        if (items.categories && items.categories.name) setpreviousCategoryname(items.categories.name);
        if (items.brand && items.brand.id) setPreviousbrandId(items.brand.id);
        if (items.brand && items.brand.name) setPreviousbrandName(items.brand.name);
        if (items.brand && items.brand.image) setPreviousbrandImage(items.brand.image);
        if (items.brand && items.brand.name) setSelectBrand(items.brand.name);
        if (items.Tax) setTax(items.Tax);

        const allVariants = [];
        if (items.varients) {
          items.varients.map((itm) => {
            allVariants.push({
              VarientName: itm.VarientName,
              originalPrice: itm.originalPrice,
              discountType: itm.discountType,
              discount: itm.discount,
              unitType: itm.unitType,
            });
          });

          if (allVariants.length == 1) {
            setUnitType(allVariants[0].unitType);
          }
        }

        const allAreas = []
        if (items.serviceable_areas) {
          items.serviceable_areas.map((item) => {
            allAreas.push({
              area_name: item.area_name,
              pincode: item.pincode,
              terretory: item.terretory
            });
          });
          setAddMoreArea(allAreas);
        }
        // Set the state with all the variants
        setVariants(allVariants);
      });
    }
  }, []);

  useEffect(() => {
    if (storeColors && storeColors.length > 0) {
      // console.log('if working ');
      setColorVar(true);
    } else {
      setColorVar(false); // Uncheck the "Yes" checkbox if there are no colors
    }
  }, [storeColors]);

  function handelStoreColor() {
    if (color !== '') {
      setStoreColors([...storeColors, color]);
      setColorInput(false);
      setColor('');
    }
  }


  function handelColorDelete(index) {
    let updaedColor = [...storeColors];
    updaedColor.splice(index, 1);
    setStoreColors(updaedColor);
  }

  //  update Product Functionality start from here

  function CancelUpdate(e) {
    e.preventDefault();
    navigate('/catalog/productlist');
  }

  async function UpdateProductDatas(e) {
    e.preventDefault();
    setLoaderstatus(true);
    try {
      const imagelinksupdate = [];
      for await (const file of imageUpload22) {
        let imageUrl = null;
        if (file instanceof File) {
          const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
          const storageRef = ref(storage, `/products/${filename}`);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        } else if (typeof file === 'string' && file.startsWith('http')) {
          imageUrl = file;
        }
        if (imageUrl) {
          imagelinksupdate.push(imageUrl);
        }
      }

      // console.log('previoisdCategoryId', previousCategoryId);

      const updateDatas = {
        name: name,
        shortDescription: shortDes,
        longDescription: longDes,
        status: status,
        sku: sku,
        totalStock: totalStock,
        stockAlert: StockCount,
        categories: {
          parent_id: previousCategoryParentId,
          id: previousCategoryId,
          name: previousCategoryname,
        },
        productImages: imagelinksupdate,
        updated_at: Date.now(),
        SalesmanCommission,
        ServiceCharge,
        DeliveryCharge,
        colors: storeColors,
        isMultipleVariant: isvarient === true,
        brand: {
          id: previousbrandId,
          name: previousbrandName,
          image: previousbrandImage
        },
        Tax,
        ...(isvarient === false
          ? {
            varients: [
              {
                VarientName: variants[0].VarientName,
                originalPrice: variants[0].originalPrice,
                discountType: variants[0].discountType,
                discount: variants[0].discount,
                unitType: variants[0].unitType,
              },
            ],
          }
          : {
            varients: variants,
          }),

        serviceable_areas: addMoreArea,


      };

      // Check if the selected category is different from the existing category
      if (selectedCategoryId === null) {
      } else {
        // console.log('update if working here ', selectedCategoryId);
        updateDatas.categories = {
          parent_id: selectedCategory.cat_ID,
          id: selectedCategory.id,
          name: selectedCategory.title,
        };
        let existingCategoryId = updateDatas.categories.id; // Update existingCategoryId
        // console.log('existing id ', existingCategoryId);

        await updateDoc(doc(db, 'sub_categories', previousCategoryId), {
          noOfProducts: increment(-1),
        });

        await updateDoc(doc(db, 'sub_categories', existingCategoryId), {
          noOfProducts: increment(1),
        });
      }


      if (brandid === null) {
      } else {
        updateDatas.brand = {
          name: selectBrand.name,
          image: selectBrand.image,
          id: selectBrand.id
        }

        let existingBrandid = updateDatas.brand.id
        await updateDoc(doc(db, 'Brands', previousbrandId), {
          totalProducts: increment(-1),
        });
        await updateDoc(doc(db, 'Brands', existingBrandid), {
          totalProducts: increment(1),
        });
      }
      await updateDoc(doc(db, 'products', ProductsID), updateDatas);
      updateProductData({
        ProductsID,
        ...updateDatas,
      });
      setLoaderstatus(false);
      toast.success('Product updated Successfully !', {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate('/catalog/productlist');
    } catch (error) {
      setLoaderstatus(false);
      console.log('Error in update Product', error);
    }
  }


  function handleSkuChange(e) {
    const newSku = e.target.value;
    if (skuList.includes(newSku)) {
      // SKU already exists, show an error or handle the duplicate SKU
      alert("SKU already exists please enter different sku");
    } else {
      // SKU is unique, set the new SKU value
      setSku(newSku);
    }
  }



  if (loaderstatus) {
    return (
      <>
        <Loader></Loader>
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
              {!productId.id ? (
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
              ) : (
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button
                      onClick={(e) => CancelUpdate(e)}
                      className="fs-sm reset_btn  border-0 fw-400 ">
                      Cancel
                    </button>
                  </button>
                  <button
                    onClick={(e) => UpdateProductDatas(e)}
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                    type="submit">
                    <img src={saveicon} alt="saveicon" />
                    Update
                  </button>
                </div>
              )}
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
                      {/* <textarea
                        id="des"
                        className="mt-2 product_input resize_none fade_grey fw-400"
                        cols="30"
                        rows="5"
                        placeholder="Enter product name"
                        value={longDes}
                        onChange={(e) => setLongDes(e.target.value)}
                      ></textarea> */}
                      <div className="add_product-text-editor mt-2">
                        <ReactQuill
                          className="rounded-lg  product_input outline-none "
                          modules={AddProduct.modules}
                          onChange={handleDescriptionChange}
                          formats={AddProduct.formats}
                          value={longDes}
                          placeholder="Write something..."
                        />
                      </div>
                    </div>
                    <br />
                    <div className="product_shadow bg_white p-3">
                      <div className="pb-3 mb-1">
                        <h2 className="fw-400 fs-2sm black mb-0">
                          Availability <span className="red ms-1 fs-sm">*</span>
                        </h2>
                        <p className="fs-xxs fw-400 black mt-1 mb-0">
                          Choose the areas where the product will be shown
                        </p>
                      </div>
                      <div className="text-end">
                        <button onClick={handlAddMoreAreas} type="button" className="fs-2sm fw-400 color_green add_varient_btn">
                          + Add More
                        </button>
                      </div>
                      <div className="row align-items-end">
                        {addMoreArea.map((area, index) => {
                          const pincode = area.pincode;
                          const areasForPincode = ServiceData
                            .filter(service => service.PostalCode === pincode)
                            .map(service => service.AreaList);

                          return (
                            <>
                              <div className=" col-4">
                                <label className="fs-xs fw-400 mt-3 black" htmlFor="pinCode">
                                  Enter Pin Code
                                </label>
                                <div className="d-flex align-items-center me-2">
                                  <input
                                    required
                                    type="number"
                                    className="mt-2 product_input fade_grey fw-400"
                                    placeholder="125001"
                                    id="pinCode"
                                    value={area.pincode}
                                    onChange={(e) => handlePincodeChange(index, e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="col-7 position-relative p-0">
                                <label className="fs-xs fw-400 mt-2 black" htmlFor="">
                                  Select Area
                                </label>
                                <div
                                  className="product_input   d-flex align-items-center justify-content-between mt-2"
                                  onClick={() => handleProductInputClick(index)}>
                                  <p className="fade_grey fw-400 w-100 mb-0 text-start" required>
                                    {area.terretory.join(' , ')}
                                  </p>
                                  <img src={dropdownImg} alt="" />
                                </div>
                                {dropdownOpen[index] && (
                                  <div ref={dropdownRef} className="position-absolute z-3 area_dropdown">
                                    {areasForPincode.map((cities, i) => (
                                      <div key={i}>
                                        {cities.map((city) => (
                                          <div className="d-flex align-items-center gap-3 py-1" key={city}>
                                            <input
                                              id={city}
                                              type="checkbox"
                                              value={city}
                                              onChange={(e) => {
                                                const isChecked = e.target.checked;
                                                const value = e.target.value;
                                                const newSelectedAreas = isChecked
                                                  ? [...(area.terretory ?? []), value]
                                                  : (area.terretory ?? []).filter((selectedCity) => selectedCity !== value);
                                                handleSelectedAreasChange(index, newSelectedAreas);
                                                // Log the selected areas
                                                // console.log('Selected Areas:', newSelectedAreas);
                                              }}
                                              checked={(area.terretory ?? []).includes(city)}
                                            />
                                            <label className="fs-xs fw-400 black w-100" htmlFor={city}>
                                              {city}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="col-1">
                                <img
                                  onClick={() => handleDeleteArea(index)}
                                  className="w-100 cursor_pointer"
                                  height={48}
                                  src={deleteiconWithBg}
                                  alt="deleteiconWithBg"
                                // onClick={() => handleDeleteArea(index) }
                                />
                              </div>
                            </>
                          )
                        })}
                      </div>
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
                            onChange={() => setisVarient(true)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="varient_yes"
                            checked={isvarient === true}
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="varient_no">
                            No
                          </label>
                          <input
                            onChange={() => setisVarient(false)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="varient_no"
                            checked={isvarient === false}
                          />
                        </div>
                      </div>
                      {isvarient === true ? (
                        <div className="text-end">
                          <button
                            onClick={HandleAddVarients}
                            type="button"
                            className="fs-2sm fw-400 color_green add_varient_btn">
                            +Add Varient
                          </button>
                        </div>
                      ) : null}
                      {isvarient === true ? (
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
                              <img
                                className="cursor_pointer"
                                onClick={() => handleDeleteVariant(index)}
                                src={deleteicon}
                                alt="deleteicon"
                              />
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-3">
                              <div className="w-100">
                                <label htmlFor="salesMan" className="fs-xs fw-400 mt-3 black">
                                  Unit type
                                </label>
                                <br />
                                <div className="d-flex align-items-center justify-content-between">
                                  <Dropdown className="category_dropdown z-1 w-100">
                                    <Dropdown.Toggle
                                      id="dropdown-basic"
                                      className="mt-2 unit_type_input border-0">
                                      <div className="product_input d-flex align-items-center justify-content-between">
                                        <p className="fade_grey fw-400 w-100 mb-0 text-start">
                                          {variant.unitType}
                                        </p>
                                        <img src={dropdownImg} alt="" />
                                      </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100 p-0">
                                      <div>
                                        <Dropdown.Item>
                                          {Units.map((item) => {
                                            return (
                                              <div className="d-flex justify-content-between">
                                                <p
                                                  onClick={(e) => {
                                                    // console.log(e.target.innerHTML);
                                                    setVariants((prevVariants) =>
                                                      prevVariants.map((v, i) =>
                                                        i === index
                                                          ? {
                                                            ...v,
                                                            unitType: e.target.innerHTML,
                                                          }
                                                          : v
                                                      )
                                                    );
                                                  }}
                                                  className="fs-xs fw-400 black mb-0 py-6px">
                                                  {item}
                                                </p>
                                                {unitType == item ? (
                                                  <img src={savegreenicon} alt="savegreenicon" />
                                                ) : null}
                                              </div>
                                            );
                                          })}
                                        </Dropdown.Item>
                                      </div>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                              <div className="w-100">
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
                                        i === index
                                          ? {
                                            ...v,
                                            originalPrice: e.target.value,
                                          }
                                          : v
                                      )
                                    )
                                  }
                                />
                              </div>
                              <div className="w-100">
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
                              <div className="w-100">
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
                                        i === index
                                          ? {
                                            ...v,
                                            discount:
                                              v.discountType === 'Percentage'
                                                ? Math.min(e.target.value, 100)
                                                : e.target.value,
                                          }
                                          : v
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
                          <div>
                            <input
                              value={variants.length == 0 ? VarintName : variants[0].VarientName}
                              required
                              className="varient_value fs-2sm fw-400 color_red"
                              placeholder="Enter Varient Name"
                              type="text"
                              onChange={(e) => {
                                if (variants.length === 0) {
                                  // Set originalPrice directly if variants array is empty
                                  setVariantsNAME(e.target.value);
                                } else {
                                  // Update originalPrice for the specific variant
                                  setVariants((prevVariants) =>
                                    prevVariants.map((v, i) =>
                                      i === 0
                                        ? {
                                          ...v,
                                          VarientName: e.target.value,
                                        }
                                        : v
                                    )
                                  );
                                }
                              }}
                            />
                          </div>
                          <div className="d-flex flex-column flex-sm-row gap-3">
                            <div className="w-100">
                              <label htmlFor="salesMan" className="fs-xs fw-400 mt-3 black">
                                Unit type
                              </label>
                              <br />
                              <div className="d-flex align-items-center justify-content-between">
                                <Dropdown className="category_dropdown z-1 w-100">
                                  <Dropdown.Toggle
                                    id="dropdown-basic"
                                    className="mt-2 unit_type_input border-0">
                                    <div className="product_input d-flex align-items-center justify-content-between">
                                      <p className="fade_grey fw-400 w-100 mb-0 text-start">
                                        {unitType}
                                      </p>
                                      <img src={dropdownImg} alt="" />
                                    </div>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="w-100 p-0">
                                    <div>
                                      <Dropdown.Item>
                                        {Units.map((item) => {
                                          return (
                                            <div
                                              onClick={() => setUnitType(item)}
                                              className="d-flex justify-content-between">
                                              <p className="fs-xs fw-400 black mb-0">{item}</p>
                                              {unitType == item ? (
                                                <img src={savegreenicon} alt="savegreenicon" />
                                              ) : null}
                                            </div>
                                          );
                                        })}
                                      </Dropdown.Item>
                                    </div>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </div>

                            {/* ist input */}
                            <div className="w-100">
                              <label htmlFor="origi" className="fs-xs fw-400 mt-3 black">
                                Original Price
                              </label>
                              <input
                                required
                                type="number"
                                className="mt-2 product_input fade_grey fw-400"
                                placeholder="₹ 0.00"
                                id="origi"
                                value={
                                  variants.length == 0 ? originalPrice : variants[0].originalPrice
                                }
                                onChange={(e) => {
                                  if (variants.length === 0) {
                                    // Set originalPrice directly if variants array is empty
                                    setOriginalPrice(e.target.value);
                                  } else {
                                    // Update originalPrice for the specific variant
                                    setVariants((prevVariants) =>
                                      prevVariants.map((v, i) =>
                                        i === 0
                                          ? {
                                            ...v,
                                            originalPrice: e.target.value,
                                          }
                                          : v
                                      )
                                    );
                                  }
                                }}
                              />
                            </div>
                            {/* 2nd input */}
                            <div className="w-100">
                              <label htmlFor="Discount" className="fs-xs fw-400 mt-3 black">
                                Discount Type
                              </label>
                              <select
                                className="mt-2 product_input  fade_grey fw-400"
                                id="Discount"
                                value={
                                  variants.length == 0 ? discountType : variants[0].discountType
                                }
                                onChange={(e) => {
                                  if (variants.length === 0) {
                                    // Set discountType directly if variants array is empty
                                    setDiscountType(e.target.value);
                                    // Reset discount value when changing the discount type to "Amount"
                                    setDiscount(e.target.value === 'Amount' ? 0 : discount);
                                  } else {
                                    // Update discountType for the specific variant
                                    setVariants((prevVariants) =>
                                      prevVariants.map((v, i) =>
                                        i === 0
                                          ? {
                                            ...v,
                                            discountType: e.target.value,
                                            // Reset discount value when changing the discount type to "Amount"
                                            discount:
                                              e.target.value === 'Amount' ? 0 : v.discount,
                                          }
                                          : v
                                      )
                                    );
                                  }
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
                            <div className="w-100">
                              <label htmlFor="ddisc" className="fs-xs fw-400 mt-3 black">
                                Discount
                              </label>
                              <input
                                required
                                type="number"
                                className="mt-2 product_input fade_grey fw-400"
                                placeholder={discountType !== 'Percentage' ? '₹ 0.00' : '%'}
                                id="ddisc"
                                value={variants.length == 0 ? discount : variants[0].discount}
                                onChange={(e) => {
                                  if (variants.length === 0) {
                                    discountType === 'Percentage'
                                      ? setDiscount(Math.min(e.target.value, 100))
                                      : setDiscount(e.target.value);
                                  } else {
                                    // Update discount for the specific variant
                                    setVariants((prevVariants) =>
                                      prevVariants.map((v, i) =>
                                        i === 0
                                          ? {
                                            ...v,
                                            discount:
                                              v.discountType === 'Percentage'
                                                ? Math.min(e.target.value, 100)
                                                : e.target.value,
                                          }
                                          : v
                                      )
                                    );
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="product_shadow bg_white p-3 mt-4">
                      <div className=" d-flex align-items-center w-75 justify-content-between pb-3 mb-1">
                        <h2 className="fw-400 fs-2sm black mb-0">
                          Have More Colours ? <span className="red ms-1 fs-sm">*</span>
                        </h2>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="color_yes">
                            Yes
                          </label>
                          <input
                            onChange={() => setColorVar(true)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="color_yes"
                            checked={colorVar === true}
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="color_no">
                            No
                          </label>
                          <input
                            onChange={() => setColorVar(false)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="color_no"
                            checked={colorVar === false}
                          />
                        </div>
                      </div>
                      {colorVar === true ? (
                        <div>
                          <h2 className="fw-400 fs-2sm black mb-0">Colours Varient</h2>
                          <div className=" d-flex align-items-center mt-3 pt-1 me-5 gap-3 flex-wrap">
                            {storeColors && storeColors.length !== 0
                              ? storeColors.map((items, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="d-flex align-items-center gap-3 color_add_input">
                                    <p className="m-0">{items}</p>
                                    <img
                                      onClick={() => handelColorDelete(index)}
                                      className="cursor_pointer"
                                      src={closeRed}
                                      alt="closeRed"
                                    />
                                  </div>
                                );
                              })
                              : null}

                            {colorInput ? (
                              <div className="color_add_input d-flex align-items-center">
                                <input
                                  onChange={(e) => setColor(e.target.value)}
                                  className="fs-xs fw-400 black me-2"
                                  type="text"
                                  value={color}
                                />
                                <img
                                  onClick={handelStoreColor}
                                  className="cursor_pointer"
                                  src={checkGreen}
                                  alt="checkGreen"
                                />
                              </div>
                            ) : null}
                            <button
                              onClick={() => setColorInput(true)}
                              type="button"
                              className="add_color_btn fs-xs fw-400 fade_grey">
                              + Add Color
                            </button>
                          </div>
                        </div>
                      ) : null}
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
                                src={
                                  img && typeof img === 'string' && img.startsWith('http')
                                    ? img
                                    : URL.createObjectURL(img)
                                }
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
                    <div className="d-flex align-items-center pb-3">
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
                      <div className="mt-3 ms-5 py-1 d-flex align-items-center gap-3">
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
                  </div>
                  <div>
                    <label htmlFor="deliveryCharge" className="fs-xs fw-400 mt-3 black pt-1">
                      Delivery Charge
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="₹ 0.00"
                        id="deliveryCharge"
                        value={DeliveryCharge}
                        onChange={(e) => setDeliveryCharges(e.target.value)}
                      />
                    </div>
                    <label htmlFor="deliveryCharge" className="fs-xs fw-400 mt-3 black pt-1">
                      Tax
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="%"
                        id="deliveryCharge"
                        value={Tax}
                        onChange={(e) => setTax(Math.min(e.target.value, 100))}
                      />
                    </div>
                    <label htmlFor="serviceCharge" className="fs-xs fw-400 mt-3 black">
                      Service charge
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="Amount"
                        id="serviceCharge"
                        value={ServiceCharge}
                        onChange={(e) => setServiceCharge(e.target.value)}
                      />
                    </div>
                    <label htmlFor="salesMan" className="fs-xs fw-400 mt-3 black">
                      Sales man Commission
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="₹ 0.00"
                        id="salesMan"
                        value={SalesmanCommission}
                        onChange={(e) => setSalesmanComssion(e.target.value)}
                      />
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
                      className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                      placeholder="6HK3I5"
                      value={sku}
                      id="sku"
                      onChange={handleSkuChange}
                    />
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
                        placeholder="Add stock to view count"
                        disabled
                        id="total"
                        value={totalStock}
                      />
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
                      type="number"
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="Enter alert count "
                      value={StockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                    />{' '}
                  </div>
                  <br />
                </div>
                {/* Categories */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <lable className="fw-400 fs-2sm black mb-0">
                    Select Brand <span className="red ms-1 fs-sm">*</span>
                  </lable>
                  <Dropdown className="category_dropdown">
                    <Dropdown.Toggle id="dropdown-basic" className="dropdown_input_btn">
                      <div className="product_input">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="fade_grey fw-400 w-100 mb-0 text-start" required>
                            {selectBrand
                              ? selectBrand.name || selectBrand
                              : 'Select Brand'}
                          </p>
                          <img src={dropdownImg} alt="dropdownImg" />
                        </div>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                      <div className="d-flex flex-column">
                        <div>
                          <button type="button" className="addnew_category_btn fs-xs green">
                            +Add <span className="black"> New Brand</span>
                          </button>
                          {allBrands.map((brand) => (
                            <Dropdown.Item>
                              <div
                                className={`d-flex justify-content-between ${selectBrand && selectBrand.id === brand.id
                                  ? 'selected'
                                  : ''
                                  }`}
                                onClick={() => handleSelectBrand(brand)}>
                                <p className="fs-xs fw-400 black mb-0">{brand.name}</p>
                                {selectBrand && selectBrand.id === brand.id && (
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
                <div className="mt-4 product_shadow bg_white p-3">
                  <lable className="fw-400 fs-2sm black mb-0">
                    Categories <span className="red ms-1 fs-sm">*</span>
                  </lable>
                  <Dropdown className="category_dropdown">
                    <Dropdown.Toggle id="dropdown-basic" className="dropdown_input_btn">
                      <div className="product_input">
                        <p className="fade_grey fw-400 w-100 mb-0 text-start" required>
                          {selectedCategory
                            ? selectedCategory.title || selectedCategory
                            : 'Select Category'}
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
                                  className={`d-flex justify-content-between ${selectedCategory && selectedCategory.id === category.id
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
AddProduct.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: true,
  },
};
AddProduct.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];
export default AddProduct;
