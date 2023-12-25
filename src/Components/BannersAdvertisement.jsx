import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import saveicon from '../Images/svgs/saveicon.svg';
import deleteicon from '../Images/svgs/deleteicon.svg';
import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, getStream } from 'firebase/storage';
import { where, query, getDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { getDocs, collection, addDoc, updateDoc, doc, arrayRemove, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useImageValidation } from '../context/validators';
import { useImageHandleContext } from '../context/ImageHandler';
import { useMainCategories } from '../context/categoriesGetter';
import { UseBannerData } from '../context/BannerGetters';
import { type } from '@testing-library/user-event/dist/type';



//  banner advertisement up start from here
// check accordian and save button

const BannersAdvertisement = () => {
  // context 
  const { BannerData } = UseBannerData()
  const { ImageisValidOrNot } = useImageHandleContext();
  const { validateImage } = useImageValidation();
  const { categoreis } = useMainCategories();

  // get intially all the uploded banners 
  const updateSelectedImages = (data) => {
    if (data) {
      const selectedImages = {};
      data.forEach((item) => {
        const title = item.title.toLowerCase();
        const imagelinks = item.data[0]?.imagelinks;
        if (imagelinks) {
          selectedImages[title] = imagelinks.map((itemurl) => itemurl.imgUrl + "$$$$" + item.id);
        }
      });

      // Now you have an object with selected images for each title
      console.log(selectedImages);

      // Example: Accessing images for largebanner
      if (selectedImages['largebanner']) {
        setSelectedImagesLargeBanner(selectedImages['largebanner']);
      }

      // Example: Accessing images for smallpatti
      if (selectedImages['smallpattbanner']) {
        setselectedImagesSmallPatii(selectedImages['smallpattbanner']);
      }

      // Example: Accessing images for categories
      if (selectedImages['categorybanners']) {
        SetCategoryImage(selectedImages['categorybanners']);
      }
      if (selectedImages['salesoffers']) {
        SetBannerSaleImg(selectedImages['salesoffers']);
      }
      if (selectedImages['animalsupliments']) {

        SetAnimalSuplimentsImages(selectedImages['animalsupliments']);
        console.log('Selected Animalsupliments:', selectedImages['animalsupliments']);
      }

      // Add more cases as needed
    }
  };

  // Use the function in useEffect
  useEffect(() => {
    updateSelectedImages(BannerData);
  }, [BannerData]);



  const [activeAccordion, setActiveAccordion] = useState(null);

  // const { LargeBannerContext } = useLargeBannerContext()

  const handleAccordionSelect = (key) => {
    setActiveAccordion(key);
  };


  /*
 *********************************************************
 Large Banner   functionaltiy start from here 
 
 */




  const [selectedImagesLargeBanner, setSelectedImagesLargeBanner] = useState([null, null])


  const handleUploadLargeBanner = async (index, e) => {
    const file = e.target.files[0];

    try {
      // Validate the image using the context function
      const validatedImage = await validateImage(file, 1, 720, 720);

      // If validation succeeds, update the state
      const newImages = [...selectedImagesLargeBanner];
      newImages[index] = validatedImage;
      setSelectedImagesLargeBanner(newImages);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };


  const handleDeleteLargeBanner = async (index) => {
    if (selectedImagesLargeBanner[index] && typeof selectedImagesLargeBanner[index] === 'string' && selectedImagesLargeBanner[index].startsWith("http")) {
      const id = selectedImagesLargeBanner[index].split("$$$$")[1];
      const storageRef = getStorage();
      var reference = ref(storageRef, selectedImagesLargeBanner[index]);
      deleteObject(reference);
      await updateDoc(doc(db, 'Banner', id), {
        data: [{
          imagelinks: [...selectedImagesLargeBanner.filter((e) => e && e.split("$$$$")[0] != selectedImagesLargeBanner[index].split("$$$$")[0]).map((e) => {
            return {
              categoryId: "",
              categoryTitle: "",
              imgUrl: e.split("$$$$")[0],
            };
          })]
        }],
      });
    }
    const newImages = [...selectedImagesLargeBanner];
    newImages[index] = null;
    setSelectedImagesLargeBanner(newImages);
  };



  async function handleSaveLargeBanner() {
    // console.log("asdfasdfdsafs",selectedImage)
    try {
      if (selectedImagesLargeBanner.every(Boolean)) {
        const imagelinks = [];
        const existingImageUrls = [];

        // Fetch existing data
        const querySnapshot = await getDocs(query(collection(db, 'Banner'), where('title', '==', 'LargeBanner')));
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];

          // Collect existing image URLs
          existingData.forEach(item => {
            const existingUrls = (item.imagelinks || []).map(img => img.imgUrl);
            existingImageUrls.push(...existingUrls);
          });
        }

        for (const file of selectedImagesLargeBanner) {
          // console.log(typeof(file))
          let imageUrl = null;

          if (file instanceof File) {
            const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
            const storageRef = ref(storage, `banner/${filename}`);
            const upload = await uploadBytesResumable(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
          } else if (typeof file === 'string') {
            // console.log(file)
            imageUrl = file.split("$$$$")[0];
          }

          // Only add new image URL (not in existingImageUrls)
          if (imageUrl && !existingImageUrls.includes(imageUrl)) {
            imagelinks.push({
              categoryId: "",
              categoryTitle: "",
              imgUrl: imageUrl,
            });
          }
        }

        if (imagelinks.length > 0) {
          try {
            // Check if the document already exists
            const querySnapshot = await getDocs(query(collection(db, 'Banner'), where('title', '==', 'LargeBanner')));

            if (querySnapshot.size > 0) {
              // Document already exists, get existing data
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              // Combine existing and new image URLs in the same imagelinks array
              const combinedImagelinks = existingData.reduce((acc, item) => {
                return acc.concat(item.imagelinks || []);
              }, []).concat(imagelinks);

              // Construct updated data with the combined imagelinks
              const updatedData = [{ imagelinks: combinedImagelinks }];

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'LargeBanner',
                data: updatedData,
              });
            } else {
              // Document doesn't exist, create a new one with new images
              const docRef = await addDoc(collection(db, 'Banner'), {
                title: 'LargeBanner',
                data: [{ imagelinks }],
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('No new images uploaded');
        }
      } else {
        console.log('Select both images before uploading');
      }

      toast.success('Large Banner Added Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
    // console.log("asdfasdf", selectedImagesLargeBanner);
  }
  /*
 *********************************************************
 Large  Banner functionaltiy end  
 
 */

  /*  
  *******************************
  Small Patti Banner Added functionlaity  start from here 
  ************************************
  */
  const [selectedImagesSmallPatii, setselectedImagesSmallPatii] = useState([null, null, null])

  const handleUploadSmallPatti = async (index, e) => {
    let file = e.target.files[0]
    try {
      // Define desired aspect ratio and dimensions for large banner
      const desiredAspectRatio = 16 / 2.5
      const desiredWidth = 1280;
      const desiredHeight = 200;

      // Validate the image using the context function
      const validatedImage = await validateImage(file, desiredAspectRatio, desiredWidth, desiredHeight);
      const newImages = [...selectedImagesSmallPatii];
      newImages[index] = validatedImage
      setselectedImagesSmallPatii(newImages);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

  };

  const handleDeleteSmallPatti = async (index) => {
    if (selectedImagesSmallPatii[index] && typeof selectedImagesSmallPatii[index] === 'string' && selectedImagesSmallPatii[index].startsWith("http")) {
      const id = selectedImagesSmallPatii[index].split("$$$$")[1];
      const storageRef = getStorage();
      var reference = ref(storageRef, selectedImagesSmallPatii[index]);
      deleteObject(reference);
      await updateDoc(doc(db, 'Banner', id), {
        data: [{
          imagelinks: [...selectedImagesSmallPatii.filter((e) => e && e.split("$$$$")[0] != selectedImagesSmallPatii[index].split("$$$$")[0]).map((e) => {
            return {
              categoryId: "",
              categoryTitle: "",
              imgUrl: e.split("$$$$")[0],
            };
          })]
        }],
      });
    }
    const newImages = [...selectedImagesSmallPatii];
    newImages[index] = null;
    setselectedImagesSmallPatii(newImages);
  };

  async function handleSaveSmallPattiBanner() {
    console.log(selectedImagesSmallPatii);
    try {
      if (selectedImagesSmallPatii.every(Boolean)) {
        const imagelinks = [];
        const existingImageUrls = [];

        // Fetch existing data
        const querySnapshot = await getDocs(query(collection(db, 'Banner'), where('title', '==', 'SmallPattBanner')));
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = (item.imagelinks || []).map(img => img.imgUrl);
            existingImageUrls.push(...existingUrls);
          });
        }

        for (const file of selectedImagesSmallPatii) {
          let imageUrl = null;
          if (file instanceof File) {
            const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
            const storageRef = ref(storage, `banner/${filename}`);
            const upload = await uploadBytesResumable(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
          } else if (typeof file === 'string') {
            imageUrl = file.split('$$$$')[0];
          }

          if (imageUrl && !existingImageUrls.includes(imageUrl)) {
            imagelinks.push({
              categoryId: "",
              categoryTitle: "",
              imgUrl: imageUrl,
            });
          }
        }

        if (imagelinks.length > 0) {
          try {
            const querySnapshot = await getDocs(query(collection(db, 'Banner'), where('title', '==', 'SmallPattBanner')));
            if (querySnapshot.size > 0) {
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              // Extract existing image URLs
              const existingUrls = existingData.reduce((acc, item) => {
                return acc.concat((item.imagelinks || []).map(img => img.imgUrl));
              }, []);

              // Filter out existing URLs from new imagelinks
              const newImagelinks = imagelinks.filter(link => !existingUrls.includes(link.imgUrl));

              // Combine existing and new imagelinks
              const combinedImagelinks = existingData.reduce((acc, item) => {
                return acc.concat(item.imagelinks || []);
              }, []).concat(newImagelinks);

              // Construct updated data with the combined imagelinks
              const updatedData = [{ imagelinks: combinedImagelinks }];

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'SmallPattBanner',
                data: updatedData,
              });
            } else {
              const docRef = await addDoc(collection(db, 'Banner'), {
                title: "SmallPattBanner",
                data: [{ imagelinks }],
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('No new images uploaded');
        }
      } else {
        console.log('Select all images before uploading');
      }
      toast.success('SmallPatti Banner Added Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
    }
  }


  /*
  *******************************
  Small Patti Banner Added functionlaity  end here 
  ************************************
  */

  /*
 *********************************************************
 Sales and offer   Banner functionaltiy start from here 
 
 */

  const [BannerSaleImg, SetBannerSaleImg] = useState([]);
  const [SelectedBannerImg, SetSelectedBannerImg] = useState(null)

  const handelSaleBannerImg = async (e) => {
    const selectedFile = e.target.files[0];

    try {
      const validatedImage = await validateImage(selectedFile, 16 / 9, 1280, 720);

      if (ImageisValidOrNot(validatedImage)) {
        SetBannerSaleImg([...BannerSaleImg, URL.createObjectURL(validatedImage)]);
        // Reset the selected image state after successful addition
        SetSelectedBannerImg(null);
      } else {
        toast.error("Invalid image format. Please select images with extensions: .png, .jpeg, .jpg, .webp, .svg");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddMediaSaleOffer = () => {
    if (selectedImage) {
      SetSelectedBannerImg([...BannerSaleImg, SelectedBannerImg]);
      SetSelectedBannerImg(null);
      document.getElementById('animal_suppliments').value = '';
    }
  };



  async function handeldeleteSaleBannerImg(index) {
    const imageUrlToDelete = BannerSaleImg[index];
    if (imageUrlToDelete && typeof imageUrlToDelete === 'string' && imageUrlToDelete.startsWith("http")) {
      const id = imageUrlToDelete.split("$$$$")[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, imageUrlToDelete);
      // Delete the image from storage
      await deleteObject(reference);

      const updatedImagelinks = BannerSaleImg
        .filter((item, i) => i !== index)
        .map((e) => {
          if (e && typeof e === 'string' && e.startsWith("http")) {
            return {
              categoryId: '', // Replace with your logic to get categoryId
              categoryImg: '', // Replace with your logic to get categoryImg
              imgUrl: e.split("$$$$")[0],
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      await updateDoc(doc(db, 'Banner', id), {
        data: [{ imagelinks: updatedImagelinks }]
      })
    }
    const multiplebanner = [...BannerSaleImg];
    multiplebanner[index] = ''
    SetBannerSaleImg(multiplebanner);


  }

  async function handleSaveBannerSliderSale() {
    try {
      if (BannerSaleImg.every(Boolean)) {
        let imagelinks = []
        for await (let files of BannerSaleImg) {
          const name = Math.floor(Date.now() / 1000) + '-' + files.name;
          const storageRef = ref(storage, `banner/${name}`);
          const uploadTask = await uploadBytesResumable(storageRef, files);
          const url = await getDownloadURL(storageRef);
          imagelinks.push({
            categoryId: "",
            categoryTitle: "",
            imgUrl: url,
          });
        }

        if (imagelinks.length > 0) {
          const docRef = await addDoc(collection(db, 'Banner'), {
            // Sales_Offers: [{
            //   title: 'Sales/Offers',
            //   imgUrl: [url],
            // }]
            title: "SalesOffers",
            data: [{ imagelinks }]
          });
        } else {
          alert('Please select at least one Image')
        }
        toast.success('Sale/Offer Banner Added   Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        console.warn('No image selected for upload');
      }
    } catch (error) {
      console.error('Error uploading image or adding document:', error);
    }
  }

  /*
 *********************************************************
    Sales and offer   Banner functionaltiy end   here 
 */

  /*  
  *********************************************************
  Animal And it's suplliments Banner functionaltiy start from here 
  
  */

  const [AnimalSuplimentsImages, SetAnimalSuplimentsImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  async function handelAnimalSuplimentImg(e) {
    const selectedFile = e.target.files[0];

    try {
      const validatedImage = await validateImage(selectedFile, 16 / 9, 1280, 720);

      if (ImageisValidOrNot(validatedImage)) {
        SetAnimalSuplimentsImages([...AnimalSuplimentsImages, URL.createObjectURL(validatedImage)]);
        // Reset the selected image state after successful addition
        setSelectedImage(null);
      } else {
        toast.error("Invalid image format. Please select images with extensions: .png, .jpeg, .jpg, .webp, .svg");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }




  async function handeldeleteAnimalSupliment(index) {
    const imageUrlToDelete = AnimalSuplimentsImages[index];
    if (imageUrlToDelete && typeof imageUrlToDelete === 'string' && imageUrlToDelete.startsWith("http")) {
      const id = imageUrlToDelete.split("$$$$")[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, imageUrlToDelete);
      // Delete the image from storage
      await deleteObject(reference);

      // Construct the updated imagelinks array
      const updatedImagelinks = AnimalSuplimentsImages
        .filter((item, i) => i !== index)
        .map((e) => {
          if (e && typeof e === 'string' && e.startsWith("http")) {
            return {
              categoryId: '', // Replace with your logic to get categoryId
              categoryImg: '', // Replace with your logic to get categoryImg
              imgUrl: e.split("$$$$")[0],
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      // Update the Firestore document
      await updateDoc(doc(db, 'Banner', id), {
        data: [{ imagelinks: updatedImagelinks }]
      });
    }

    // Update the component state
    const newAnimalSuplimentsImages = [...AnimalSuplimentsImages];
    newAnimalSuplimentsImages[index] = ''; // Set the image for the specified index to an empty string
    SetAnimalSuplimentsImages(newAnimalSuplimentsImages);
    // Trigger a re-render by updating the key
    // updateSelectedImages(BannerData);
  }


  async function HandleSaveAnimalSuppliments() {
    try {
      if (AnimalSuplimentsImages.every(Boolean)) {
        let imagelinks = []
        for await (let files of AnimalSuplimentsImages) {
          const name = Math.floor(Date.now() / 1000) + '-' + files.name;
          const storageRef = ref(storage, `banner/${name}`);
          const uploadTask = await uploadBytesResumable(storageRef, files);
          const url = await getDownloadURL(storageRef);
          imagelinks.push({
            categoryId: "",
            categoryTitle: "",
            imgUrl: url,
          });
        }

        if (imagelinks.length > 0) {
          try {
            const docRef = await addDoc(collection(db, 'Banner'), {
              // AnimalSupliments: [
              //   {
              //     title: 'AnimalSupliments ',
              //     imgUrl: [url],
              //   }
              // ]
              title: "AnimalSupliments",
              data: [{ imagelinks }]
            });
          }
          catch (error) {
            console.log('Error Adding Image To The Database', error);
          }
        }
        else {
          alert("please select at least one image ")
        }
      } else {
        console.warn('No image selected for upload');
      }
      toast.success('Animal Supliments  Banner Added   Successfully !', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error('Error uploading image or adding document:', error);
    }
  }



  const handleAddMedia = () => {
    if (selectedImage) {
      SetAnimalSuplimentsImages([...AnimalSuplimentsImages, selectedImage]);
      setSelectedImage(null);
      document.getElementById('animal_suppliments').value = '';
    }
  };

  /*
 *********************************************************
  Animal And it's suplliments Banner functionaltiy end from here 
 
 */



  /*
*********************************************************
 Categoroies  Banner functionaltiy start 
*/

  const [CategoryImage, SetCategoryImage] = useState(Array(categoreis.length).fill(''));

  async function handleCategoryImages(e, index) {
    let file = e.target.files[0];
    try {
      // Define desired aspect ratio and dimensions for large banner
      const desiredAspectRatio = 16 / 9
      const desiredWidth = 1280;
      const desiredHeight = 720;

      // Validate the image using the context function
      const validatedImage = await validateImage(file, desiredAspectRatio, desiredWidth, desiredHeight);

      // If validation succeeds, update the state
      const newCategoryImages = [...CategoryImage];
      newCategoryImages[index] = validatedImage
      SetCategoryImage(newCategoryImages);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  async function handleCategoryImagesDelete(index) {
    /*
    if (selectedImagesLargeBanner[index] && typeof selectedImagesLargeBanner[index] === 'string' && selectedImagesLargeBanner[index].startsWith("http")) {
      const id = selectedImagesLargeBanner[index].split("$$$$")[1];
      const storageRef = getStorage();
      var reference = ref(storageRef, selectedImagesLargeBanner[index]);
      deleteObject(reference);
      await updateDoc(doc(db, 'Banner', id), {
        data: [{
          imagelinks: [...selectedImagesLargeBanner.filter((e) => e && e.split("$$$$")[0] != selectedImagesLargeBanner[index].split("$$$$")[0]).map((e) => {
            return {
              categoryId: "",
              categoryTitle: "",
              imgUrl: e.split("$$$$")[0],
            };
          })]
        }],
      });
    }
    */
    if (CategoryImage[index] && typeof CategoryImage[index] === 'string' && CategoryImage[index].startsWith("http")) {
      const id = CategoryImage[index].split("$$$$")[1]
      const storageRef = getStorage()
      let reference = ref(storageRef, CategoryImage[index])
      deleteObject(reference)
      await updateDoc(doc(db, 'Banner', id), {
        data: [{
          imagelinks: [...CategoryImage.filter((item) => item && item.split("$$$$")[0] != CategoryImage[index].split("$$$$")[0]).map((e) => {
            return {
              categoryId: '',
              categoryImg: '',
              imgUrl: e.split("$$$$")[0],
            }
          })]
        }]
      })
    }
    const newCategoryImages = [...CategoryImage];
    newCategoryImages[index] = ''; // Set the image for the specified index to an empty string
    SetCategoryImage(newCategoryImages);
  }

  async function handleUpdateCategoryBanner(e) {
    e.preventDefault();
    try {
      const imagelinks = []; // Initialize an array to store banner objects

      for (let index = 0; index < categoreis.length; index++) {
        const category = categoreis[index];
        if (CategoryImage[index]) {
          const name = Math.floor(Date.now() / 1000) + '-' + CategoryImage[index].name;
          const storageRef = ref(storage, `banner/${name}`);
          const uploadTask = await uploadBytesResumable(storageRef, CategoryImage[index]);
          const url = await getDownloadURL(storageRef);

          // Push the banner object into the array
          imagelinks.push({
            categoryId: category.id,
            categoryTitle: category.title,
            imgUrl: url,
          });
        }
      }

      // Add the array of banners as a single document in the 'Banner' collection
      await addDoc(collection(db, 'Banner'), {
        // CategoryBanners: bannerArray,
        title: "CategoryBanners",
        data: [{ imagelinks }]
      });
      toast.success(`Banner for Categories added successfully!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    }

  }

  /*
*********************************************************
 Categoroies  Banner functionaltiy end 
*/

  return (


    <div className="main_panel_wrapper pb-2  bg_light_grey w-100">
      <form>
        <div className="banner_advertisement">
          <div className=" d-flex align-items-center justify-content-between  mt-4">
            <h1 className="fw-500  mb-0 black fs-lg">Banners / Advertisement</h1>
          </div>
          <Accordion
            className="border-0 w-100 rounded-none"
            activeKey={activeAccordion}
            onSelect={handleAccordionSelect}>
            <Accordion.Item className="py-1 bg-white" eventKey="0">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400 black mb-0">Large Banner</h3>
                  {activeAccordion === '0' ? (
                    <button
                      onClick={handleSaveLargeBanner}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                  {/*Single Medium Banner */}
                  <div className="bg_white pe-1">
                    <input
                      type="file"
                      id="largeBanner1"
                      onChange={(e) => handleUploadLargeBanner(0, e)}
                      hidden
                    />

                    {!selectedImagesLargeBanner[0] ? (
                      <label
                        htmlFor="largeBanner1"
                        className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesLargeBanner[0] && (
                        <div className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={selectedImagesLargeBanner[0] && typeof selectedImagesLargeBanner[0] === 'string' && selectedImagesLargeBanner[0].startsWith("http") ? selectedImagesLargeBanner[0].split("$$$$")[0] : URL.createObjectURL(selectedImagesLargeBanner[0])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteLargeBanner(0)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="mt-3 mt-lg-0">
                    <div className="bg_white ps-2">
                      <input
                        type="file"
                        id="largeBanner2"
                        onChange={(e) => handleUploadLargeBanner(1, e)}
                        hidden
                      />

                      {!selectedImagesLargeBanner[1] ? (
                        <label
                          htmlFor="largeBanner2"
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                          + Add Media
                        </label>
                      ) : (
                        (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={selectedImagesLargeBanner[1] && typeof selectedImagesLargeBanner[1] === 'string' && selectedImagesLargeBanner[1].startsWith("http") ? selectedImagesLargeBanner[1].split("$$$$")[0] : URL.createObjectURL(selectedImagesLargeBanner[1])}
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteLargeBanner(1)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                          </div>
                        )
                        // ) : <div className="position-relative imagemedia_btn">
                        //   <img
                        //     className="w-100 h-100 object-fit-cover"
                        //     src={URL.createObjectURL(selectedImagesLargeBanner[1])}
                        //     alt=""
                        //   />
                        //   <img
                        //     onClick={() => handleDeleteLargeBanner(1)}
                        //     className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                        //     src={deleteicon}
                        //     alt="deleteicon"
                        //   />
                        // </div>
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Banner Slider for sales / offers  */}
            <Accordion.Item className="py-1 bg-white rounded" eventKey="1">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Sales / Offers</h3>
                  {activeAccordion === '1' ? (
                    <button
                      onClick={handleSaveBannerSliderSale}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                  {/*Single Medium Banner */}
                  <div className="bg_white pe-1">
                    <input
                      type="file"
                      id="Sales_Offers"
                      accept="image/*"
                      multiple
                      onChange={handelSaleBannerImg}
                      hidden
                    />
                    <div className="d-flex gap-3 flex-wrap">
                      {SelectedBannerImg && (
                        <div className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={SelectedBannerImg}
                            alt=""
                          />
                          <button
                            onClick={handleAddMediaSaleOffer}
                            className="position-absolute bottom-0 start-50 translate-middle cursor_pointer bg-green px-2 py-1 rounded"
                            type="button"
                          >
                            Add Media
                          </button>
                        </div>
                      )}

                      {BannerSaleImg.map((offerbanner, index) => (
                        <div key={index} className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={offerbanner}
                            alt=""
                          />
                          <img
                            onClick={() => handeldeleteSaleBannerImg(index)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      ))}
                      {!SelectedBannerImg && (
                        <label
                          htmlFor="animal_suppliments"
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Media
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* small patti banners  */}
            <Accordion.Item className="py-1 bg-white rounded" eventKey="2">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400  black mb-0">Small Patti Banner</h3>
                  {activeAccordion === '2' ? (
                    <button
                      onClick={handleSaveSmallPattiBanner}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2 justify-content-between">
                  <div className="bg_white w-100">
                    <input
                      type="file"
                      id="smallPatti1"
                      onChange={(e) => handleUploadSmallPatti(0, e)}
                      hidden
                    />

                    {!selectedImagesSmallPatii[0] ? (
                      <label
                        htmlFor="smallPatti1"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesSmallPatii[0] && (
                        <div className="position-relative imagesmallmedia_btn w-100">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={selectedImagesSmallPatii[0] && typeof selectedImagesSmallPatii[0] === 'string' && selectedImagesSmallPatii[0].startsWith("http") ? selectedImagesSmallPatii[0].split("$$$$")[0] : URL.createObjectURL(selectedImagesSmallPatii[0])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteSmallPatti(0)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg_white w-100">
                    <input
                      type="file"
                      id="smallPatti2"
                      onChange={(e) => handleUploadSmallPatti(1, e)}
                      hidden
                    />

                    {!selectedImagesSmallPatii[1] ? (
                      <label
                        htmlFor="smallPatti2"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesSmallPatii[1] && (
                        <div className="position-relative imagesmallmedia_btn w-100">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={selectedImagesSmallPatii[1] && typeof selectedImagesSmallPatii[1] === 'string' && selectedImagesSmallPatii[1].startsWith("http") ? selectedImagesSmallPatii[1].split("$$$$")[0] : URL.createObjectURL(selectedImagesSmallPatii[1])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteSmallPatti(1)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div className="bg_white w-100">
                    <input
                      type="file"
                      id="smallPatti3"
                      onChange={(e) => handleUploadSmallPatti(2, e)}
                      hidden
                    />

                    {!selectedImagesSmallPatii[2] ? (
                      <label
                        htmlFor="smallPatti3"
                        className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                        + Add Media
                      </label>
                    ) : (
                      selectedImagesSmallPatii[2] && (
                        <div className="position-relative imagesmallmedia_btn w-100">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={selectedImagesSmallPatii[2] && typeof selectedImagesSmallPatii[2] === 'string' && selectedImagesSmallPatii[2].startsWith("http") ? selectedImagesSmallPatii[2].split("$$$$")[0] : URL.createObjectURL(selectedImagesSmallPatii[2])}
                            alt=""
                          />
                          <img
                            onClick={() => handleDeleteSmallPatti(2)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            {/* banner slider for animal suppliments */}

            <Accordion.Item className="py-1 bg-white rounded" eventKey="3">
              <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                <div className="d-flex justify-content-between w-100">
                  <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Animal Suppliments</h3>
                  {activeAccordion === '3' ? (
                    <button
                      onClick={HandleSaveAnimalSuppliments}
                      className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                      type="submit">
                      <img src={saveicon} alt="saveicon" />
                      Save
                    </button>
                  ) : null}
                </div>
              </Accordion.Header>
              <Accordion.Body className="py-2 px-3">
                <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                  <div className="bg_white">
                    <input
                      type="file"
                      onChange={handelAnimalSuplimentImg}
                      id="animal_suppliments"
                      hidden
                    />
                    <div className="d-flex gap-3 flex-wrap">
                      {selectedImage && (
                        <div className="position-relative imagemedia_btn">
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={selectedImage}
                            alt=""
                          />
                          <button
                            onClick={handleAddMedia}
                            className="position-absolute bottom-0 start-50 translate-middle cursor_pointer bg-green px-2 py-1 rounded"
                            type="button"
                          >
                            Add Media
                          </button>
                        </div>
                      )}
                      {AnimalSuplimentsImages.map((animalSupbanner, index) => (

                        <div key={index} className="position-relative imagemedia_btn" >
                          {console.log(animalSupbanner)}
                          <img
                            className="w-100 h-100 object-fit-cover"
                            src={animalSupbanner && typeof animalSupbanner === 'string' && animalSupbanner.startsWith("http") ? animalSupbanner : animalSupbanner}
                            alt=""
                          />
                          <img
                            onClick={() => handeldeleteAnimalSupliment(index)}
                            className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                            src={deleteicon}
                            alt="deleteicon"
                          />
                        </div>
                      ))}
                      {!selectedImage && (
                        <label
                          htmlFor="animal_suppliments"
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Media
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            <div className="d-flex align-items-center justify-content-between mt-3">
              <p className="fs-sm fw-700 black pt-1 mt-3">Categorized Banners</p>
              <button
                className="d-flex align-items-center update_banners_btn"
                onClick={(e) => handleUpdateCategoryBanner(e)}>
                <img src={saveicon} alt="saveicon" />
                <p className="fs-sm fw-600 black mb-0 ms-2">Update Banner</p>
              </button>
            </div>
            {categoreis.map((data, index) => {
              return (
                <Accordion.Item className="py-1 bg-white rounded" eventKey={index}>
                  <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                    <div className="d-flex justify-content-between w-100">
                      <h3 className="fs-sm fw-400  black mb-0">{data.title}</h3>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="py-2 px-3">
                    <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                      <div className="bg_white">
                        <input
                          type="file"
                          id={`categoreis_${index}`}
                          onChange={(e) => handleCategoryImages(e, index)}
                          hidden
                        />

                        {!CategoryImage[index] ? (
                          <label
                            htmlFor={`categoreis_${index}`}
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                            + Add Media
                          </label>
                        ) : (
                          CategoryImage[index] && (
                            <div className="position-relative imagemedia_btn">
                              <img
                                className="w-100 h-100 object-fit-cover"
                                src={CategoryImage[index] && typeof CategoryImage[index] === 'string' && CategoryImage[index].startsWith("http") ? CategoryImage[index].split("$$$$")[0] : URL.createObjectURL(CategoryImage[index])}
                                //src={ CategoryImage[index].startsWith("https") ? CategoryImage[index] : URL.createObjectURL(CategoryImage[index])}
                                // {selectedImagesSmallPatii[2] && typeof selectedImagesSmallPatii[2] === 'string' && selectedImagesSmallPatii[2].startsWith("http") ? selectedImagesSmallPatii[2].split("$$$$")[0] : URL.createObjectURL(selectedImagesSmallPatii[2])}
                                alt=""
                              />
                              <img
                                onClick={() => handleCategoryImagesDelete(index)}
                                className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                                src={deleteicon}
                                alt="deleteicon"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </form >
      <ToastContainer />
    </div >
  );
};

export default BannersAdvertisement;
