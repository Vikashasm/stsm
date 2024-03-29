import React, { useState } from 'react';
import ComplainCusPic from '../../Images/Png/complain-pic.png';
import DropdownBlack from '../../Images/svgs/dropdown-black.svg';
import ReplyBtn from '../../Images/svgs/reply-icon.svg';
import SendIcon from '../../Images/svgs/send-icon.svg';

export default function ComplainDetails() {
  const [reply, setReply] = useState(false);
  const [replyContent, setReplyContent] = useState(false);
  const [replytext, setReplyText] = useState('');
  function handelSubmitReply() {
    setReplyContent(true);
    setReply(false);
  }
  return (
    <div className="complain_details mt-4 pe-3">
      <div className="mt-2 p_20 complain_bg">
        <div>
          <div className="d-flex align-items-center">
            <img
              className="brs_50"
              height={60}
              width={60}
              src={ComplainCusPic}
              alt="ComplainCusPic"
            />
            <div className="w-100 ms-2">
              <div className="px_10 w-100">
                <div className="d-flex align-items-center justify-content-between w-100">
                  <p className="fs-2sm fw-500 black m-0">Microsoft account team</p>
                  <p className="fs-xs fw-400 black opacity-75 m-0">Mon, Jan 29, 12:12 PM</p>
                </div>
                <div className="d-flex align-items-center mt-2 cursor_pointer">
                  <p className="fs-xs fw-400 black opacity-75 m-0">to me</p>
                  <img className="px_10 " src={DropdownBlack} alt="DropdownBlack" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-1 ps-5 ms-4">
            <p className="fs_16 fw-400 black">
              Hi,
              <span className="color_blue">navdeepghanghas5109@gmail.com</span>
            </p>
            <p className="mt-4 pt-1 fs-xs fw-400 black">
              Lorem ipsum dolor sit amet consectetur. Vivamus velit elit non nunc ipsum
              sollicitudin. Nisl laoreet massa lectus adipiscing quisque aliquam amet. Velit ante
              sed enim nibh. Faucibus accumsan at nunc ullamcorper ut. Enim felis eget risus justo
              laoreet. Magna euismod auctor accumsan lacus id. Eu ac vestibulum neque ut eu id. Dui
              fusce lectus nunc aliquet facilisi odio phasellus feugiat. Ac blandit varius pulvinar
              ante duis. A lectus eu faucibus quis ac. Interdum urna nunc vitae in bibendum.
              Pellentesque suscipit odio purus quis sit eget aliquam. Risus diam nibh auctor
              maecenas id fermentum pharetra lacus in. Vitae sed nulla ullamcorper congue. Molestie
              lacus mattis amet duis in blandit nulla gravida. Ut purus orci auctor duis viverra.
              Risus venenatis augue risus nunc ullamcorper. Vitae lobortis eget convallis rutrum
              integer felis velit lacus velit. Quisque felis ipsum volutpat dis tempus risus quis.
              Aliquam viverra id nullam tortor neque aliquam arcu. Duis ut aliquet ut quam. Vivamus
              lorem risus turpis ut.llamcorper. Vitae lobortis eget convallis rutrum integer felis
              velit lacus velit. Quisque felis ipsum volutpat dis tempus risus quis. Aliquam viverra
              id nullam tortor neque aliquam arcu. Duis ut aliquet ut quam. Vivamus lorem risus
              turpis ut.
            </p>
          </div>
        </div>
        {replyContent ? (
          <div className="mt-5 pt-4">
            <div className="d-flex align-items-center">
              <img
                className="brs_50"
                height={60}
                width={60}
                src={ComplainCusPic}
                alt="ComplainCusPic"
              />
              <div className="w-100 ms-2">
                <div className="px_10 w-100">
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <p className="fs-2sm fw-500 black m-0">Microsoft account team</p>
                    <p className="fs-xs fw-400 black opacity-75 m-0">Mon, Jan 29, 12:12 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 pt-1 fs-xs fw-400 black ms-5 ps-4">{replytext}</p>
          </div>
        ) : null}
        {!reply ? (
          <div className="d-flex align-items-center mt-4 ms-5 ps-4">
            <button
              onClick={() => setReply(true)}
              className="d-flex align-items-center reply_btn gap-1">
              <img src={ReplyBtn} alt="ReplyBtn" />
              <p className="fs_20 fw-400 black m-0">Reply</p>
            </button>
            <button className="fs_20 fw-400 text-white resolve_btn ms-2">Resolve</button>
          </div>
        ) : null}

        {reply ? (
          <div className="mx-5 px-4 mt-3 pt-1">
            <div className="d-flex align-items-end gap-2">
              <textarea
                onChange={(e) => setReplyText(e.target.value)}
                className="complian_Reply_input"
                placeholder="type your reply ....."></textarea>
              <img
                onClick={handelSubmitReply}
                className="cursor_pointer"
                src={SendIcon}
                alt="SendIcon"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
