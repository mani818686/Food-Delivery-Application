import React, { useEffect, useState } from 'react';
import { getData } from '../../http-post-service';
import "./index.css"
import { useNavigate } from 'react-router-dom';
function Orders() {
  const [orderData, setOrderData] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const getOrderData = async () => {
      try {
        const data = await getData("/customer/allOrders");
        setOrderData(data.orders);
        console.log(data.orders)
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    getOrderData();
  }, []);

  const handleOrder = (order)=>{
    navigate("/order/"+order._id)
  }

  return (
    <div className='order-container'>
      <div className="title"><h2>Your Orders</h2></div>
      <div className='order-items'>
        {orderData && orderData?.map((order, index) => (
          <div className="order-card" key={index} onClick={()=>handleOrder(order)}>
            {order.Items.length === 1 ? (
              <img src={"/uploads/"+order.Items[0]?.productId?.image}  width="80px" height={"60px"} alt={"uploads/"+order.Items[0].productId.image} />
            ) : (
              <img src={"/uploads/"+order.Items[0]?.productId?.image} width="80px" height="60px" alt={"/uploads/"+order.Items[0].productId.image} 
              />
            )}
            <div className="order-details">
              <p>Total Products: {order.Items.length}</p>
              <p>Price: ${order.price.toFixed(2)}</p>
              <p>Delivery Date: {new Date(order.date).toLocaleDateString()}</p>
              <p>Order Status : {order.orderStatus}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
