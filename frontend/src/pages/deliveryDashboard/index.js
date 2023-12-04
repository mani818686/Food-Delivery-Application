import React, { useState, useEffect } from 'react'
import "./index.css"
import { getData, postData } from '../../http-post-service'


const DeliveryDashboard = () => {
  const [deliveryDetails, setDeliveryDetails] = useState([]);

  useEffect(() => {
    console.log("object")
    const getProfile = async () => {
      try {
        const data = await getData("/delivery/");
        console.log(data); // Add this line
        setDeliveryDetails(data.delivery.delivery);
      } catch (error) {
        console.error(error);
      }
    };
  
    getProfile();
  }, []);

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    // Update the delivery status on the server for the specific delivery
    try {
        let data = {status:newStatus}
        const response = await postData("/delivery/update/"+deliveryId,JSON.stringify(data))
        if(response.message == 'updated'){
            setDeliveryDetails((prevDetails) =>
          prevDetails.map((delivery) =>
            delivery._id === deliveryId ? { ...delivery, status: newStatus } : delivery
          )
        );
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  return (
    <div style={{marginTop:'10%'}}>
      <h2>Delivery Details</h2>
      {deliveryDetails.map((delivery) => (
        <div key={delivery._id}>
          <div>
            <strong>Customer Name:</strong> {delivery.customer.firstName} {delivery.customer.lastName}
          </div>
          <div>
            <strong>Email:</strong> {delivery.customer.email}
          </div>
          <div>
            <strong>Phone Number:</strong> {delivery.customer.phoneNumber}
          </div>
          <div>
            <strong>Delivery Address:</strong> {delivery.address.street}{' Street ,'}
            {delivery.address.city}, {delivery.address.state},{' '}
            {delivery.address.country}
          </div>
          <div>
            <strong>Expected Delivery Date:</strong>{' '}
            {new Date(delivery.expectedDeliverydate).toLocaleDateString()}
          </div>
          <div>
            <strong>Status:</strong> {delivery.status}
          </div>
          <div  className='test-select'>
            <label>
              <strong>Update Status:</strong>{' '}
              <select 
             
                value={delivery.status}
                onChange={(e) => handleStatusUpdate(delivery._id, e.target.value)}
              >
                 <option value="Ordered">Ordered</option>
                <option value="On the way">On the way</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </label>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;
