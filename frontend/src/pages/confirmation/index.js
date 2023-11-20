import React from 'react'
import "./index.css"
function Confirmation({orderDetails}) {
  return (
    <div className='confirmation-container'>
        <div style={styles.container}>
      <h2 style={styles.header}>Order Confirmation</h2>
      <p style={styles.message}>Thank you for your order! Your purchase is now confirmed.</p>

      <div style={styles.section}>
        <h3 style={styles.subHeader}>Order Details:</h3>
        <ul style={styles.list}>
          <li>Order ID: {orderDetails.orderDetails._id}</li>
          <li>Price: ${orderDetails.orderDetails.price}</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subHeader}>Order Items:</h3>
        <ul style={styles.list}>
          {orderDetails.orderItems.map((item) => (
            <li key={item._id}>
              {item.name} - ${item.price}
              {/* <p>{item.description}</p> */}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subHeader}>Payment Details:</h3>
        <ul style={styles.list}>
          <li>Payment Method: {orderDetails.paymentDetails.paymentMethod}</li>
          <li>Amount: ${orderDetails.paymentDetails.amount}</li>
          <li>Payment Details: {orderDetails.paymentDetails.paymentDetails}</li>
          <li>Date: {new Date(orderDetails.paymentDetails.date).toLocaleString()}</li>
        </ul>
      </div>

      {/* <div style={styles.section}>
        <h3 style={styles.subHeader}>Delivery Details:</h3>
        <ul style={styles.list}>
          <li>Delivery Type: {orderDetails.deliveryDetails.type}</li>
          <li>Delivery Status: {orderDetails.deliveryDetails.status}</li>
        </ul>
      </div> */}

      {/* <div style={styles.section}>
        <h3 style={styles.subHeader}>Delivery Person Information:</h3>
        <ul style={styles.list}>
          <li>Name: {orderDetails.deliverypersonInfo[0].firstName} {orderDetails.deliverypersonInfo[0].lastName}</li>
          <li>Email: {orderDetails.deliverypersonInfo[0].email}</li>
          <li>Phone Number: {orderDetails.deliverypersonInfo[0].phoneNumber}</li>
        </ul>
      </div> */}
    </div>
    </div>
  )
}

export default Confirmation

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