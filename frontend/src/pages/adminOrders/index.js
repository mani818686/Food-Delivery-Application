import React, { useEffect, useState } from "react";
import { getData, postData } from "../../http-post-service";
import "./index.css";
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

function AdminOrders() {
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const data = await getData("/admin/orders");
        setOrderData(data.orders);
        console.log(data.orders);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    getOrderData();
  }, []);

  const handleOrderCancel = async (orderId,status) => {
    let d = {status:status}
    try {
      const res = await postData("/admin/cancelorder/" + orderId,JSON.stringify(d));
      if (res.message === "order Cancelled") {
        console.log(res);
        window.location.reload();
      } else console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };
  const handleRefund = async (paymentId)=>{
    try {
        const res = await postData("/admin/refund/" + paymentId);
        if (res.message === "order Cancelled") {
          console.log(res);
          window.location.reload();
        } else console.log(res);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
  }

  return (
    <div className="order-container">
      <div className="title">
        <h2>Orders</h2>
      </div>
      <div className="order-items">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">OrderId</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Total Amount</th>
              <th scope="col">No of Items</th>
              <th scope="col">Date</th>
              <th scope="col">Order Status</th>
              <th scope="col">Order Action</th>
              <th scope="col">Payment Status</th>
              <th scope="col">Payment Action</th>
            </tr>
          </thead>
          <tbody>
            {orderData &&
              orderData?.map((order, index) => {
                return (
                  <tr>
                    <th scope="">{order._id}</th>
                    <th scope="col">
                      {order.customerId.firstName}
                      {order.customerId.lastName}
                    </th>
                    <th scope="col">${order.price}</th>
                    <th scope="col">{order.Items.length}</th>
                    <th scope="col">
                      {new Date(order.date).toLocaleDateString()}
                    </th>
                    <th scope="col">{order.orderStatus}</th>
                    <th>
                      <button
                        disabled={order.orderStatus!== "Ordered"}
                        style={{
                          backgroundColor:
                            (order.orderStatus !== "Ordered") ? "grey" : "red",
                            border:'1px solid white',
                          color: "white", // Change text color as needed
                        }}
                        className="danger-button"
                        onClick={() => handleOrderCancel(order._id,'Cancelled')}
                      >
                        <CancelIcon/>
                      </button>
                      <button
                        disabled={order.orderStatus !== "Ordered"}
                        style={{
                          backgroundColor:
                            order.orderStatus!== "Ordered" ? "grey" : "red",
                            border:'1px solid white',
                          color: "white", // Change text color as needed
                        }}
                        className="danger-button"
                        onClick={() => handleOrderCancel(order._id,'Approved')}
                      >
                        <DoneIcon/>
                      </button>
                    </th>
                   <th scope="col">{order.paymentId.status}</th>
                    <th scope="col">
                         <div><button
                        disabled={order.orderStatus === "refunded"}
                        style={{
                          backgroundColor:
                            order.paymentId.status === "refunded" ? "grey" : "green",
                            border:'1px solid white',
                          color: "white", // Change text color as needed
                        }}
                        className="danger-button"
                        onClick={() => handleRefund(order.paymentId._id,'Approved')}
                      >Initiate Refund </button>
                      </div>
                      </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* {orderData &&
          orderData?.map((order, index) => (
            <div
              className="order-card"
              key={index}
              onClick={() => handleOrder(order)}
            >
              {order.Items.length === 1 ? (
                <img
                  src={"/uploads/" + order.Items[0]?.productId?.image}
                  width="80px"
                  height={"60px"}
                  alt={"uploads/" + order.Items[0]?.productId?.image}
                />
              ) : (
                <img
                  src={"/uploads/" + order.Items[0]?.productId?.image}
                  width="80px"
                  height="60px"
                  alt={"/uploads/" + order.Items[0]?.productId?.image}
                />
              )}
              <div className="order-details">
                <p>Total Products: {order.Items.length}</p>
                <p>Price: ${order.price.toFixed(2)}</p>
                <p>
                  Delivery Date: {new Date(order.date).toLocaleDateString()}
                </p>
                <p>Order Status : {order.orderStatus}</p>
              </div>
            </div>
          ))} */}
      </div>
    </div>
  );
}

export default AdminOrders;
