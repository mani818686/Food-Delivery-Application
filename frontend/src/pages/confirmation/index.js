import React, { useEffect, useState } from 'react';
import "./index.css";
import { getData } from '../../http-post-service';

function Confirmation({ orderDetails }) {
  const [orderData, setOrderData] = useState(orderDetails ?? {});

  const [orderItems,setOrderItems] = useState(orderDetails.orderItems?.Items)

  const [paymentDetails ,setPaymentDetails ] = useState(orderDetails.paymentDetails)

  useEffect(() => {
    console.log(Object.keys(orderDetails).length)
    const getOrderData = async () => {
      if (Object.keys(orderDetails).length == 0 ) {
        try {
          let result = await getData("/customer/lastOrder");
          console.log(result);
          setOrderData(result);
          console.log(result.orderDetails.Items);
          setOrderItems(result.orderDetails.Items)
          setPaymentDetails(result.orderDetails.paymentId)
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      }
    };

    getOrderData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className='confirmation-container'>
      <div style={styles.container}>
        <h2 style={styles.header}>Order Confirmation</h2>
        <p style={styles.message}>Thank you for your order! Your purchase is now confirmed.</p>
        <p style={styles.message}>You will receive your order shortly..</p>

        <div style={styles.section}>
          <h3 style={styles.subHeader}>Order Details:</h3>
          <ul style={styles.list}>
            <li>Order ID: {orderData?.orderDetails?._id}</li>
            <li>Price: ${orderData?.orderDetails?.price}</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subHeader}>Order Items:</h3>
          <ul style={styles.list}>
            {orderItems?.map((item) => (
              <li key={item.productId?._id}>
                {item.productId?.name} - ${item.productId?.price}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.subHeader}>Payment Details:</h3>
          <ul style={styles.list}>
            <li>Payment Method: {paymentDetails?.paymentMethod}</li>
            <li>Amount: ${paymentDetails?.amount}</li>
            <li>Payment Details: {paymentDetails?.paymentDetails}</li>
            <li>Date: {new Date(paymentDetails?.date).toLocaleString()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    color: '#333',
  },
  message: {
    color: 'green',
  },
  section: {
    marginBottom: '20px',
  },
  subHeader: {
    color: '#333',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
};
