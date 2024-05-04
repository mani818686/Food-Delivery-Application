import React, { useState, useEffect } from "react";
import "./index.css";
import { getData, postData } from "../../http-post-service";

const DeliveryDashboard = () => {
  const [deliveryDetails, setDeliveryDetails] = useState([]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await getData("/delivery/");
        console.log(data); // Add this line
        setDeliveryDetails(data.delivery.orderId);
      } catch (error) {
        console.error(error);
      }
    };

    getProfile();
  }, []);

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    // Update the delivery status on the server for the specific delivery
    try {
      let data = { status: newStatus };
      const response = await postData(
        "/delivery/update/" + deliveryId,
        JSON.stringify(data)
      );
      if (response.message == "updated") {
        setDeliveryDetails((prevDetails) =>
          prevDetails.map((delivery) =>
            delivery._id === deliveryId
              ? { ...delivery, orderStatus: newStatus }
              : delivery
          )
        );
      }
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <div style={{ marginTop: "10%" }}>
      <h2>Delivery Details</h2>
      <table className="table">
        <tr>
          <th>Customer Name</th>
          <th>Customer Email</th>
          <th>Customer Phone Number</th>
          <th>Customer Delivery Address</th>
          <th> Delivery Status</th>
          <th> Action</th>
        </tr>

        {deliveryDetails.map((delivery) => (
          <tr className="delivery-card" key={delivery._id}>
            <td>
              {delivery.customerId.firstName} {delivery.customerId.lastName}
            </td>
            <td>{delivery.customerId.email}</td>
            <td>{delivery.customerId.phoneNumber}</td>
            <td>
              {delivery.customerId.address[0].street}
              {" Street ,"}
              {delivery.customerId.address[0].city},{" "}
              {delivery.customerId.address[0].state},{" "}
              {delivery.customerId.address[0].country}
            </td>
            {/* <div>
            <strong>Expected Delivery Date:</strong>{' '}
            {new Date(delivery.expectedDeliverydate).toLocaleDateString()}
          </div> */}
            <td>{delivery.orderStatus}</td>
            <td className="test-select">
              <select
                value={delivery.orderStatus}
                onChange={(e) =>
                  handleStatusUpdate(delivery._id, e.target.value)
                }
              >
                <option value="Ordered">Ordered</option>
                <option value="On the way">On the way</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default DeliveryDashboard;
