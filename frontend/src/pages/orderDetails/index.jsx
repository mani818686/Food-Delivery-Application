import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import { getData } from '../../http-post-service';
import "./index.css"

function OrderDetails() {
  const { orderId } = useParams(); // Get the order ID from the URL parameter
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await getData(`/customer/order/${orderId}`);
        setOrderDetails(data.orders[0]);
        console.log(data.orders)
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    getOrderDetails();
  }, [orderId]);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className='order-detail-container'>
      <h2>Order Details</h2>
      <p>Order ID: {orderDetails._id}</p>
      <p>Total Products: {orderDetails.Items.length}</p>
      <p>Price: ${orderDetails.price.toFixed(2)}</p>
      <p>Delivery Date: {new Date(orderDetails.date).toLocaleDateString()}</p>
      <p>Order Status: {orderDetails.orderStatus}</p>

      <div className="product-details">
        {orderDetails.Items.map((item, index) => (
          <div className="product-card" key={index}>
            <img src={"/uploads/"+item.productId.image} width="300px" height = "300px "alt={item.productId.name} />
            <div className="product-info">
              <p>Product: {item.productId.name}</p>
              <p>Price: ${item.productId.price.toFixed(2)}</p>
              <p>Variant: {item.productId.variantId.size} - {item.productId.variantId.color}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;
