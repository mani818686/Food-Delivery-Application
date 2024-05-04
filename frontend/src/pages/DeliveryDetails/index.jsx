import React, { useEffect, useState } from "react";
import { getData, postData } from "../../http-post-service";
import "./index.css";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

function DeliveryDetails() {
  const [deliveryData, setDeliveryData] = useState([]);


  useEffect(()=>{
    const getDeliveryData = async () => {
      try {
        const data = await getData("/delivery/all");
        setDeliveryData(data.delivery);
        console.log(data.delivery);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };
    getDeliveryData();
  },[])

  return (
    <div className="order-container">
      <div className="title">
        <h2>Delivery Person Details</h2>
      </div>
      <div className="order-items">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">S.NO</th>
              <th scope="col">Delivery Person Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {deliveryData &&
              deliveryData?.map((order, index) => {
                return (
                  <tr>
                    <th scope="">{index+1}</th>
                    <th scope="col">
                      {order.firstName}
                      {order?.lastName}
                    </th>
                    <th scope="col">{order.email}</th>
                    <th scope="col">{order?.address[0]?.street}{' Street, '}{order?.address[0]?.city}{", "}{order?.address[0]?.state}{", "}{order?.address[0]?.country}{", "}{order?.address[0]?.pincode}</th>
                    <th scope="col">{order?.phoneNumber}</th>
                    <th scope="col">{order.orderId.length}</th>
                    
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveryDetails;
