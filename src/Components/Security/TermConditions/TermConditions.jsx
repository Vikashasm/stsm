import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import Loader from "../../Loader";
import { Editor } from '@tinymce/tinymce-react';
import 'react-toastify/dist/ReactToastify.css';

const TermConditions = () => {

  const [value, setValue] = useState("");
  const [loading, setloading] = useState(false)



  useEffect(() => {
    setloading(true)
    const fetchData = async () => {
      try {
        const docRef = doc(db, "configs", "Bm71yYK1ZFSjJ9TpFbCm");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setValue(docSnap.data().value || "");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
      setloading(false);
    };
    fetchData();
  }, []);



  // const handleChange = (content, delta, source, editor) => {
  //   const deltaOps = editor.getContents().ops;
  //   const deltaHtml = convertDeltaToHtml(deltaOps);
  //   setValue(deltaHtml);
  // };

  function handleChange(editor) {
    const content = editor.getContent();
    setValue(content);
  }


  // const convertDeltaToHtml = deltaOps => {
  //   const converter = new QuillDeltaToHtmlConverter(deltaOps, {});
  //   return converter.convert();
  // };



  async function handleUpdateData(e) {
    e.preventDefault()
    setloading(true)
    try {
      await updateDoc(doc(db, 'configs', 'Bm71yYK1ZFSjJ9TpFbCm'), {
        value,
      });

      setloading(false)
      toast.success('Term and Condition updated !', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log("Error in update TermConditions", error);
    }
  }


  if (loading) {
    return (
      <>
        <Loader></Loader>
      </>
    )

  } else {
    return (
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body">
          <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
            <div className="d-flex">
              <h1 className="fw-500   black fs-lg mb-0">Terms and Conditions</h1>
            </div>
            <button onClick={(e) => handleUpdateData(e)} className="addnewproduct_btn black  fs-sm px-sm-3 px-2 py-2 fw-400 ">
              Update
            </button>
          </div>
          <div className="rich-text-editor mt-5">
            {/* <ReactQuill
              style={{ height: "400px" }}
              className="rounded-lg border w-full mt-[30px] p-[10px] border-[#D9D9D9] border-solid outline-none h-100"
              modules={TermConditions.modules}
              onChange={handleChange}
              formats={TermConditions.formats}
              value={value}
              placeholder="Write something..."
            /> */}
            <Editor
              className="rounded-lg  product_input outline-none "
              apiKey="y0dtf4480oa45ebxji2fnpvejkapyz2na98m86zwrshcbt7h"
              value={value}
              onEditorChange={(content, editor) => {
                handleChange(editor); // Pass the editor object to your custom handler
              }}
              init={{
                placeholder: 'Write something...',
                plugins:
                  'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | spellcheckdialog | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                  { value: 'First.Name', title: 'First Name' },
                  { value: 'Email', title: 'Email' },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
              }}
            />
          </div>
        </div>
      </div>
    );
  };
}




TermConditions.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: true,
  },
};



TermConditions.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

export default TermConditions;
