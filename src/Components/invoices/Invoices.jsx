import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { InvoicesList } from '../../Common/Helper';
import rightDubbleArrow from '../../Images/svgs/dubble-arrow.svg';
import billLogo from '../../Images/svgs/bill-logo.svg';
import pdfIcon from '../../Images/svgs/pdf-icon.svg';
import printIcon from '../../Images/svgs/print-icon2.svg';
import { ReactToPrint } from 'react-to-print';
import { useOrdercontext } from '../../context/OrderGetter';
import { type } from '@testing-library/user-event/dist/type';
import search from "../../Images/svgs/search.svg";
export default function Invoices() {
  const [viewSideBill, setViewSideBIll] = useState(false);
  const [selectedBill, setSelectedBill] = useState([]);
  const [viewPdf, setViewPdf] = useState(false);
  const [inovicesOrder, setInvoicesOrder] = useState([]);

  const [filtervalue, setFilterValue] = useState("");
  const { orders } = useOrdercontext();

  useEffect(() => {
    let filterData = orders.filter((order) => order.hasOwnProperty('invoiceNumber'));
    setInvoicesOrder([...filterData]);
  }, [orders]);

  useEffect(() => {
    if (inovicesOrder.length > 0) {
      setSelectedBill([inovicesOrder[0]]);
    }
  }, [inovicesOrder]);

  const handleBillNumberClick = (invoiceNumber) => {
    const bill = orders.filter((order) => order.invoiceNumber === invoiceNumber);
    setSelectedBill([...bill]);
  };

  // format date function start
  function formatDate(dateString) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate.replace('at', '|');
  }



  const componentRef = useRef();

  return (
    <>
      <div className="main_panel_wrapper bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 mt-4 bg_body invoice_data overflow-x-hidden">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="fw-500 black fs-lg mb-0">Invoices</h1>
            <div>
              <div className="d-flex px-2 gap-2 align-items-center input_wrapper">
                <img src={search} alt="searchicon" />
                <input
                  type="text"
                  value={filtervalue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="fw-400 categorie_input"
                  placeholder="Search for Customers..."
                />
              </div>
            </div>
            <img
              onClick={() =>
                setViewSideBIll(viewSideBill === true ? false : true)
              }
              className={`transform_rotate cursor_pointer ${
                viewSideBill === true ? "transform_rotate_arrow" : ""
              }`}
              src={rightDubbleArrow}
              alt="rightDubbleArrow"
            />
          </div>

          {/* categories details  */}

          <div className="px-3 pb-2 bg-white product_shadow mt-4 position-relative">
            <div
              className={`side_invoice_view ${
                viewSideBill === true ? "showbill" : ""
              }`}
            >
              <div className="d-flex align-items-center justify-content-end gap-3">
                {/* <NavLink
                    to="/invoicesbill"
                    className="d-flex align-items-center view_pdf_btn"
                  >
                    <p className="fs-xxs fw-400 black mb-0">View PDF</p>
                    <img src={pdfIcon} alt="pdfIcon" />
                  </NavLink> */}
                <ReactToPrint
                  trigger={() => {
                    return (
                      <button
                        onClick={() => window.print()}
                        className="d-flex align-items-center view_pdf_btn ms-1"
                      >
                        <p className="fs-xxs fw-400 black mb-0">PRINT</p>
                        <img src={printIcon} alt="printIcon" />
                      </button>
                    );
                  }}
                  content={() => componentRef.current}
                  documentTitle="Invoice"
                  pageStyle="print"
                />
              </div>
              {selectedBill.length > 0
                ? selectedBill.map((items) => {
                    const subtotal = items.items.reduce(
                      (acc, data) => acc + data.quantity * data.final_price,
                      0
                    );
                    return (
                      <div className="mt-3">
                        <div className="d-flex align-items-start justify-content-between gap-3">
                          <div className="w-50">
                            <p className="fs-xs fw-700 black mb-0">
                              # {items.invoiceNumber}
                            </p>
                            <p className="fs-xs fw-700 black mb-0">
                              Save Time Save Money
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              Near TVS Agency, Hansi Road, Barwala
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              Hisar, Haryana - 125121
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              GSTIN : 06GWMPS2545Q1ZJ
                            </p>
                          </div>
                          <div className="text-end w-50">
                            <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
                            <p className="fs-xxs fw-700 black mb-0">
                              {items.customer.name}
                            </p>
                            <p
                              style={{ maxWidth: "235px" }}
                              className="fs-xs fw-400 black mb-0 mt-1"
                            >
                              {items.shipping.address}
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-1">
                              {items.shipping.city}, {items.shipping.state}
                            </p>
                            <p className="fs-xs fw-400 black mb-0 mt-4 text-end">
                              Invoice Date : {formatDate(items.created_at)}
                            </p>
                          </div>
                        </div>
                        <table className="w-100 mt-3">
                          <thead>
                            <tr className="bg_dark_black">
                              <th className="fs-xxs fw-400 white p_10">#</th>
                              <th className="fs-xxs fw-400 white p_10">
                                Item Description
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-center">
                                Qty
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-end">
                                Unit Cost
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-center">
                                Tax
                              </th>
                              <th className="fs-xxs fw-400 white p_10 text-end">
                                Line Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.items.map((data) => {
                              return (
                                <tr>
                                  <td className="fs-xxs fw-400 black p_5_10">
                                    1
                                  </td>
                                  <td className="p_5_10">
                                    <span>
                                      <p className="fs-xxs fw-400 black mb-0">
                                        {data.title}
                                      </p>
                                      <span className="d-flex align-items-center gap-2">
                                        <p className=" fs-xxxs fw-700 black mb-0">
                                          ₹ {data.varient_discount} OFF
                                        </p>
                                        <p
                                          className={`fs-xxxs fw-400 black mb-0  ${
                                            data.varient_discount !== "0"
                                              ? "strikethrough"
                                              : null
                                          }`}
                                        >
                                          MRP : {data.varient_price}
                                        </p>
                                      </span>
                                      <span className="d-flex align-items-center gap-3">
                                        <p className=" fs-xxxs fw-400 black mb-0">
                                          {data.varient_name} {data.unitType}
                                        </p>
                                        <p className="fs-xxxs fw-400 black mb-0">
                                          {data.color}
                                        </p>
                                      </span>
                                    </span>
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-center">
                                    {data.quantity}
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                                    {data.final_price}
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-center">
                                    {typeof data.Tax === "undefined"
                                      ? "0"
                                      : data.Tax}
                                    %
                                  </td>
                                  <td className="fs-xxs fw-400 black p_5_10 text-end">
                                    ₹
                                    {data.quantity * data.final_price +
                                      (typeof data.text === "undefined"
                                        ? 0
                                        : data.quantity *
                                          data.final_price *
                                          (data.Tax / 100))}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="d-flex align-items-center justify-content-between mt-3">
                          <div className="w-75 text-end">
                            <p className="fs_xxs fw-700 black mb-0">
                              Sub Total
                            </p>
                            <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                              Promo Discount
                            </p>
                            <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                              Total Amount
                            </p>
                          </div>
                          <div className="text-end">
                            <p className="fs_xxs fw-400 black mb-0">
                              ₹{subtotal}
                            </p>
                            <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                              (-) ₹ {items.additional_discount.discount}
                            </p>
                            <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                              ₹{subtotal - items.additional_discount.discount}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
            <div className="overflow_xl_scroll line_scroll">
              <div style={{ minWidth: "1500px" }}>
                <table className="w-100">
                  <thead className="w-100 table_head">
                    <tr className="product_borderbottom">
                      <th className="mx_220 p-2">
                        <p className="fw-400 fs-sm black mb-0 cursor_pointer">
                          # Invoice
                        </p>
                      </th>
                      <th className="mx_180 px-2 py-3">
                        <p className="fs-sm fw-400 black mb-0">Customer</p>
                      </th>
                      <th className=" mw-250 cursor_pointer px-2 py-3">
                        <p className="fw-400 fs-sm black mb-0">Date</p>
                      </th>
                      <th className="mx_150 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">Amount</h3>
                      </th>
                      <th className="mx_150 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">Total Tax</h3>
                      </th>
                      <th className="mx_180 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Payment Status
                        </h3>
                      </th>
                      <th className="mw-200 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">
                          Payment Mode
                        </h3>
                      </th>
                      <th className="mw-200 px-2 py-3">
                        <h3 className="fs-sm fw-400 black mb-0">Paid On</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table_body">
                    {inovicesOrder
                      .filter((data) => {
                        return filtervalue.toLowerCase() === ""
                          ? data
                          : data.customer.name
                              .toLowerCase()
                              .includes(filtervalue);
                      })
                      .sort((a, b) => b.order_price - a.order_price)
                      .map((items) => {
                        let TotalTaxPaid = items.items.reduce(
                          (acc, data) =>
                            acc +
                            data.quantity *
                              data.final_price *
                              (typeof data.Tax === "undefined"
                                ? 0
                                : data.Tax / 100),
                          0
                        );
                        return (
                          <tr className="product_borderbottom">
                            <td className="px-2 py-3 mx_220">
                              {items.invoiceNumber !== "" ? (
                                <Link
                                  onClick={() => {
                                    handleBillNumberClick(items.invoiceNumber);
                                    setViewSideBIll(
                                      viewSideBill === false ? true : true
                                    );
                                  }}
                                  className="fs-sm fw-400 color_blue mb-0"
                                >
                                  #
                                  {items.invoiceNumber === ""
                                    ? "N/A"
                                    : items.invoiceNumber}
                                </Link>
                              ) : (
                                <p className="fs-sm fw-400 color_blue mb-0">
                                  #
                                  {items.invoiceNumber === ""
                                    ? "N/A"
                                    : items.invoiceNumber}{" "}
                                </p>
                              )}
                            </td>
                            <td className="px-2 py-3 mx_180">
                              <Link
                                to={
                                  items.order_created_by === "Van"
                                    ? ""
                                    : `/customer/viewcustomerdetails/${items.uid}`
                                }
                                className="fs-sm fw-400 color_blue mb-0"
                              >
                                {items.customer.name}
                              </Link>
                            </td>
                            <td className="px-2 py-3 mw-250">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {formatDate(items.created_at)}
                              </h3>
                            </td>
                            <td className="px-2 py-3 mx_150">
                              <h3 className="fs-sm fw-400 black mb-0">
                                ₹ {items.order_price}
                              </h3>
                            </td>
                            <td className="px-2 py-3 mx_150">
                              <h3 className="fs-sm fw-400 black mb-0">
                                ₹ {TotalTaxPaid}
                              </h3>
                            </td>
                            <td className="px-2 py-3 mx_180">
                              <h3
                                className={`fs-sm fw-400 black mb-0 ${
                                  items.transaction.status === "Pending"
                                    ? "unpiad"
                                    : "paid_invoice"
                                }`}
                              >
                                {items.transaction.status}
                              </h3>
                            </td>
                            <td className="px-2 py-3 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {items.transaction.mode}
                              </h3>
                            </td>
                            <td className="px-2 py-3 mw-200">
                              <h3 className="fs-sm fw-400 black mb-0">
                                {items.transaction.date === ""
                                  ? "-"
                                  : formatDate(items.transaction.date)}
                              </h3>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/************* {Invoice PDF} *************/}

      <div className="order_details_bill">
        {selectedBill.length > 0
          ? selectedBill.map((items) => {
              const subtotal = items.items.reduce(
                (acc, data) => acc + data.quantity * data.final_price,
                0
              );
              const savedDiscount = items.items.reduce(
                (acc, data) => acc + data.quantity * data.varient_discount,
                0
              );
              return (
                <div className="bill m-auto" ref={componentRef}>
                  <div className="d-flex align-items-start justify-content-between">
                    <img src={billLogo} alt="billLogo" />
                    <div className="text-end">
                      <h1 className="fs_24 fw-700 black mb-0">INVOICE</h1>
                      <p className="fs-xxs fw_700 black mb-0">
                        #{items.invoiceNumber}
                      </p>
                      <p className="fs-xs fw_400 green mb-0">
                        {items.transaction.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex align-items-start justify-content-between gap-3">
                      <div className="w-50">
                        <p className="fs-xs fw-700 black mb-0">
                          Save Time Save Money
                        </p>
                        <p className="fs-xs fw-400 black mb-0 mt-1">
                          Near TVS Agency, Hansi Road, Barwala,
                        </p>
                        <p className="fs-xs fw-400 black mb-0 mt-1">
                          Hisar, Haryana - 125121
                        </p>
                        <p className="fs-xs fw-400 black mb-0 mt-1">
                          GSTIN : 06GWMPS2545Q1ZJ
                        </p>
                      </div>
                      <div className="text-end w-50">
                        <p className="fs-xxs fw-700 black mb-0">Bill To:</p>
                        <p className="fs-xxs fw-700 black mb-0">
                          {items.customer.name}
                        </p>
                        <p className="fs-xs fw-400 black mb-0 mt-1">
                          {items.shipping.address}
                        </p>
                        <p className="fs-xs fw-400 black mb-0 mt-1">
                          {items.shipping.city} {items.shipping.state}{" "}
                        </p>
                        <p className="fs-xs fw-400 black mb-0 mt-4 text-end">
                          Invoice Date : {formatDate(items.created_at)}
                        </p>
                      </div>
                    </div>
                    <table className="w-100 mt-3">
                      <thead>
                        <tr className="bg_dark_black">
                          <th className="fs-xxs fw-400 white p_10">#</th>
                          <th className="fs-xxs fw-400 white p_10">
                            Item Description
                          </th>
                          <th className="fs-xxs fw-400 white p_10 text-center">
                            Qty
                          </th>
                          <th className="fs-xxs fw-400 white p_10 text-end">
                            Unit Cost
                          </th>
                          <th className="fs-xxs fw-400 white p_10 text-center">
                            Tax
                          </th>
                          <th className="fs-xxs fw-400 white p_10 text-end">
                            Line Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.items.map((data) => {
                          return (
                            <tr>
                              <td className="fs-xxs fw-400 black p_5_10">1</td>
                              <td className="p_5_10">
                                <span>
                                  <p className="fs-xxs fw-400 black mb-0">
                                    {data.title}
                                  </p>
                                  <span className="d-flex align-items-center gap-2">
                                    <p className=" fs-xxxs fw-700 black mb-0">
                                      ₹ {data.varient_discount} OFF
                                    </p>
                                    <p
                                      className={`fs-xxxs fw-400 black mb-0  ${
                                        data.varient_discount !== "0"
                                          ? "strikethrough"
                                          : null
                                      }`}
                                    >
                                      MRP : {data.varient_price}
                                    </p>
                                  </span>
                                  <span className="d-flex align-items-center gap-3">
                                    <p className=" fs-xxxs fw-400 black mb-0">
                                      {data.varient_name} {data.unitType}
                                    </p>
                                    <p className="fs-xxxs fw-400 black mb-0">
                                      {data.color}
                                    </p>
                                  </span>
                                </span>
                              </td>
                              <td className="fs-xxs fw-400 black p_5_10 text-center">
                                {data.quantity}
                              </td>
                              <td className="fs-xxs fw-400 black p_5_10 text-end">
                                {data.final_price}
                              </td>
                              <td className="fs-xxs fw-400 black p_5_10 text-center">
                                {typeof data.Tax === "undefined"
                                  ? "0"
                                  : data.Tax}
                                %
                              </td>
                              <td className="fs-xxs fw-400 black p_5_10 text-end">
                                ₹
                                {data.quantity * data.final_price +
                                  (typeof data.text === "undefined"
                                    ? 0
                                    : data.quantity *
                                      data.final_price *
                                      (data.Tax / 100))}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="w-75 text-end">
                        <p className="fs_xxs fw-700 black mb-0">Sub Total</p>
                        <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                          Promo Discount
                        </p>
                        <p className="fs_xxs fw-700 black mt-2 pt-1 mb-0">
                          Total Amount
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="fs_xxs fw-400 black mb-0">₹{subtotal}</p>
                        <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                          (-) ₹ {items.additional_discount.discount}
                        </p>
                        <p className="fs_xxs fw-400 black mb-0 pt-1 mt-2">
                          {/* {((data.quantity * data.final_price) * (data.Tax / 100))} */}
                          {items.order_price}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="mt-3 bill_border d-inline-block"></span>
                  <p className=" fs-xxxs fw-400 black mb-0 mt-1">
                    Note : You Saved{" "}
                    <span className="fw-700"> ₹{savedDiscount} </span> on
                    product discount.
                  </p>
                  {items.transaction.status === "Paid" ? (
                    <div>
                      <p className="fs_xxs fw-400 black mb-0 mt-3">
                        Transactions:
                      </p>
                      <table className="mt-3 w-100">
                        <thead>
                          <tr>
                            <th className="fs-xxs fw-400 black py_2">
                              Transaction ID
                            </th>
                            <th className="fs-xxs fw-400 black py_2">
                              Payment Mode
                            </th>
                            <th className="fs-xxs fw-400 black py_2">Date</th>
                            <th className="fs-xxs fw-400 black py_2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bill_border">
                            <td className="fs-xxs fw-400 black py-1">
                              {items.transaction.tx_id === ""
                                ? "N/A"
                                : items.transaction.tx_id}
                            </td>
                            <td className="fs-xxs fw-400 black py-1">
                              {items.transaction.mode}
                            </td>
                            <td className="fs-xxs fw-400 black py-1">
                              {formatDate(items.transaction.date)}
                            </td>
                            <td className="fs-xxs fw-400 black py-1">
                              ₹{items.order_price}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}
      </div>
    </>
  );
}
