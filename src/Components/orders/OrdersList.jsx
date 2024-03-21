import React, { useEffect, useState } from 'react';
import filtericon from '../../Images/svgs/filtericon.svg';
import SearchIcon from '../../Images/svgs/search.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import updown_icon from '../../Images/svgs/arross.svg';
import shortIcon from '../../Images/svgs/short-icon.svg';
import { Link } from 'react-router-dom';
import { useOrdercontext } from '../../context/OrderGetter';
import { exec } from 'apexcharts';


const OrderList = () => {
  // context
  const { orders, updateData } = useOrdercontext();
  const [searchvalue, setSearchvalue] = useState('');

  // format date logic start from here
  // console.log(orderStatus);
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate.replace('at', '|');
  }

  /*  *******************************
  checkbox functionality start 
*********************************************   **/
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Check if all checkboxes are checked
    const allChecked = orders.every((item) => item.checked);
    setSelectAll(allChecked);
  }, [orders]);

  // Main checkbox functionality start from here

  const handleMainCheckboxChange = () => {
    const updatedData = orders.map((item) => ({
      ...item,
      checked: !selectAll,
    }));
    updateData(updatedData);
    setSelectAll(!selectAll);
  };

  // Datacheckboxes functionality strat from here
  const handleCheckboxChange = (index) => {
    const updatedData = [...orders];
    updatedData[index].checked = !orders[index].checked;
    updateData(updatedData);

    // Check if all checkboxes are checked
    const allChecked = updatedData.every((item) => item.checked);
    setSelectAll(allChecked);
  };

  /*  *******************************
      Checbox  functionality end 
    *********************************************   **/

  /*  *******************************
      Sorting Functionality start from here 
    *********************************************   **/

  const [order, setorder] = useState('ASC');
  const sorting = (col) => {
    // Create a copy of the data array
    const sortedData = [...orders];

    if (order === 'ASC') {
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        const valueB = b[col].toLowerCase();
        return valueA.localeCompare(valueB);
      });
    } else {
      // If the order is not ASC, assume it's DESC
      sortedData.sort((a, b) => {
        const valueA = a[col].toLowerCase();
        console.log('asdf', valueA);
        const valueB = b[col].toLowerCase();
        return valueB.localeCompare(valueA);
      });
    }

    // Update the order state
    const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
    setorder(newOrder);

    // Update the data using the updateData function from your context
    updateData(sortedData);
  };

  /*  *******************************
      Sorting Functionality end from here  
    *********************************************   **/



  /*  *******************************
    Export  Excel File start from here  
  *********************************************   **/
  const ExcelJS = require('exceljs');

  function exportExcelFile() {
    const workbook = new ExcelJS.Workbook()
    const excelSheet = workbook.addWorksheet("Order List")
    excelSheet.properties.defaultRowHeight = 20;

    excelSheet.getRow(1).font = {
      name: "Conic Sans MS",
      family: 4,
      size: 14,
      bold:true,
    }
    excelSheet.columns = [
      {
        header: "OrderNumber",
        key: "OrderNumber",
        width: 15,
      },
      {
        header: "Invoice",
        key: "Invoice",
        width: 15,

      },
      {
        header: "Date",
        key: "Date",
        width: 15,

      },
      {
        header: "Customer",
        key: "Customer",
        width: 15,

      },
      {
        header: "PaymentStatus",
        key: "PaymentStatus",
        width: 15,
      },
      {
        header: "OrderStatus",
        key: "OrderStatus",
        width: 15,
      },
      {
        header: "items",
        key: "items",
        width: 15,
      },
      {
        header: "OrderPrice",
        key: "OrderPrice",
        width: 15,
      }

      
    ]

    orders.map((order) => {
      excelSheet.addRow({
        OrderNumber: order.order_id,
        Invoice: typeof (order.invoiceNumber) === "undefined" ? "N/A" : order.invoiceNumber,
        Date: formatDate(order.created_at),
        Customer: order.customer.name,
        PaymentStatus: order.transaction.status,
        OrderStatus: order.status,
        items: order.items.length,
        OrderPrice: order.order_price,
      })
    })


    workbook.xlsx.writeBuffer().then(data => {
      let blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url;
      anchor.download = 'orderList.xlsx'
      anchor.click()
      window.URL.revokeObjectURL(url);

    })


  }








  /*  *******************************
  Export  Excel File end  here  
*********************************************   **/









  return (
    <div className="main_panel_wrapper overflow-x-hidden bg_light_grey w-100">
      <div className="w-100 px-sm-3 pb-4 bg_body mt-4">
        <div className="d-flex  align-items-center flex-column flex-sm-row  gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500  mb-0 black fs-lg">Orders</h1>
          </div>
          <div className="d-flex align-itmes-center gap-3">
            <form className="form_box   mx-2 d-flex p-2 align-items-center" action="">
              <div className="d-flex">
                <img src={SearchIcon} alt=" search icon" />
              </div>
              <input
                type="text"
                className="bg-transparent  border-0 px-2 fw-400  outline-none"
                placeholder="Search for Orders"
                onChange={(e) => setSearchvalue(e.target.value)}
              />
            </form>
            <button className="filter_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
              <img className="me-1" width={24} src={filtericon} alt="filtericon" />
              Filter
            </button>

            <button onClick={exportExcelFile} className="export_btn  white fs-xxs px-3 py-2 fw-400 border-0">Export</button>

          </div>
        </div>
        {/* product details  */}
        <div className="p-3 mt-4 bg-white product_shadow">
          <div className="overflow-x-scroll line_scroll">
            <div style={{ minWidth: "1650px" }}>
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom">
                    <th className="mw-200 p-3 w-100 cursor_pointer" onClick={() => sorting('id')}>
                      <div className="d-flex align-items-center min_width_300">
                        <label className="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleMainCheckboxChange}
                          />
                          <span className="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0 ms-2">
                          Order Number
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
                    <th className='mw-200 p-2'>
                      <h3 className="fs-sm fw-400 black mb-0">Invoice</h3>
                    </th>
                    <th className="mw-200 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Date</h3>
                    </th>
                    <th className="mw-200 p-3" onClick={() => sorting('customer.name')}>
                      <h3 className="fs-sm fw-400 black mb-0">Customer </h3>
                    </th>
                    <th className="mw_160 p-3">
                      <span className="d-flex align-items-center">
                        <h3 className="fs-sm fw-400 black mb-0 white_space_nowrap">
                          Payment Status
                        </h3>
                      </span>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Order Status</h3>
                    </th>
                    <th className="mw_140 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Items</h3>
                    </th>
                    <th className="mw_160 p-3">
                      <h3 className="fs-sm fw-400 black mb-0">Order Price</h3>
                    </th>
                    <th className="mx_100 p-3 pe-4 text-center">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">
                  {orders
                    .filter((items) => {
                      return (
                        searchvalue.toLowerCase() === '' ||
                        items.id.toLowerCase().includes(searchvalue)
                      );
                    })
                    .map((orderTableData, index) => {
                      return (
                        <tr>
                          <td className="p-3 w-100">
                            <div className="min_width_300  d-flex align-items-center">
                              <label className="check1 fw-400 fs-sm black mb-0">
                                <input
                                  type="checkbox"
                                  checked={orderTableData.checked || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                                <span className="checkmark"></span>
                              </label>
                              <Link
                                className="fw-400 fs-sm color_blue ms-2"
                                to={`orderdetails/${orderTableData.order_id}`}>
                                # {orderTableData.order_id}
                              </Link>
                            </div>
                          </td>
                          <td className="p-2 mw-200">
                            <h3 className="fs-xs fw-400 color_blue mb-0">
                              #{typeof (orderTableData.invoiceNumber) === "undefined" ? 'N/A' : orderTableData.invoiceNumber}
                            </h3>
                          </td>
                          <td className="p-3 mw-200">
                            <h3 className="fs-xs fw-400 black mb-0">
                              {formatDate(orderTableData.created_at)}
                            </h3>
                          </td>
                          <td className="p-3 mw-200">
                            <Link to={`/customer/viewcustomerdetails/${orderTableData.uid}`}>
                              <h3 className="fs-sm fw-400 color_blue mb-0">
                                {orderTableData.customer.name}
                              </h3>
                            </Link>
                          </td>
                          <td className="p-3 mw_160">
                            <h3
                              className={`fs-sm fw-400 mb-0 d-inline-block ${orderTableData.transaction.status.toString().toLowerCase() ===
                                'paid'
                                ? 'black stock_bg'
                                : orderTableData.transaction.status.toString().toLowerCase() ===
                                  'cod'
                                  ? 'black cancel_gray'
                                  : orderTableData.transaction.status.toString().toLowerCase() ===
                                    'refund'
                                    ? 'new_order red'
                                    : 'color_brown on_credit_bg'
                                }`}>
                              {orderTableData.transaction.status}
                            </h3>
                          </td>
                          <td className="p-3 mw_160">
                            <p
                              className={`d-inline-block ${orderTableData.status.toString().toLowerCase() === 'new'
                                ? 'fs-sm fw-400 red mb-0 new_order'
                                : orderTableData.status.toString().toLowerCase() === 'processing'
                                  ? 'fs-sm fw-400 mb-0 processing_skyblue'
                                  : orderTableData.status.toString().toLowerCase() === 'delivered'
                                    ? 'fs-sm fw-400 mb-0 green stock_bg'
                                    : 'fs-sm fw-400 mb-0 black cancel_gray'
                                }`}>
                              {orderTableData.status}
                            </p>
                          </td>
                          <td className="p-3 mw_140">
                            <h3 className="fs-sm fw-400 black mb-0">
                              {orderTableData.items.length} items
                            </h3>
                          </td>
                          <td className="p-3 mw_160">
                            <h3 className="fs-sm fw-400 black mb-0">
                              ₹ {orderTableData.order_price}
                            </h3>
                          </td>
                          <td className="text-center mx_100">
                            <div class="dropdown">
                              <button
                                class="btn dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton3"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <img src={dropdownDots} alt="dropdownDots" />
                              </button>
                              <ul
                                class="dropdown-menu categories_dropdown"
                                aria-labelledby="dropdownMenuButton3">
                                <li>
                                  <div class="dropdown-item" href="#">
                                    <div className="d-flex align-items-center categorie_dropdown_options">
                                      <img src={eye_icon} alt="" />
                                      <Link to={`orderdetails/${orderTableData.order_id}`}>
                                        <p className="fs-sm fw-400 black mb-0 ms-2">View Details</p>
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
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
  );
};

export default OrderList;
