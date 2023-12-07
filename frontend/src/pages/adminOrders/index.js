import React, { useEffect, useState } from "react";
import { getData, postData } from "../../http-post-service";
import "./index.css";
import { useNavigate } from "react-router-dom";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

function AdminOrders() {
  const [orderData, setOrderData] = useState([]);
  const [delivery,setDelivery] = useState([])
  const [orderId,setOrder] = useState('')
  const navigate = useNavigate();
  
  const [selectedDelivery,setSelectedDelivery] = useState(0)


  const handleSelect = (v) =>{
    setSelectedDelivery(v)
  }
  const handleAssign = async()=>{
    const deliveryId = delivery[selectedDelivery]._id
    try{
      const data = await postData("/admin/approve/"+orderId+"/"+deliveryId);
      if(data.message === "order updated"){
        console.log(data)
        document.body.classList.remove('modal-open');
            document.getElementById('exampleModal').remove('show')
            var backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
            window.location.reload();
      }
    }
    catch (error) {
      console.error("Error fetching order data:", error);
    }
  }

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

  useEffect(()=>{
    const getDeliveryData = async () => {
      try {
        const data = await getData("/delivery/all");
        setDelivery(data.delivery);
        console.log(data.delivery);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    };
    getDeliveryData();
  },[])



  

  const handleOrderCancel = async (orderId, status) => {
    let d = { status: status };
    try {
      const res = await postData(
        "/admin/cancelorder/" + orderId,
        JSON.stringify(d)
      );
      if (res.message === "order Cancelled") {
        console.log(res);
        window.location.reload();
      } else console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };
 // onClick={() => handleOrderCancel(order._id, "Approved")}
  const handleRefund = async (paymentId) => {
    try {
      const res = await postData("/admin/refund/" + paymentId);
      if (res.message === "order Cancelled") {
        console.log(res);
        window.location.reload();
      } else console.log(res);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

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
                      {order.customerId?.firstName}
                      {order.customerId?.lastName}
                    </th>
                    <th scope="col">${order.price}</th>
                    <th scope="col">{order?.Items?.length}</th>
                    <th scope="col">
                      {new Date(order.date).toLocaleDateString()}
                    </th>
                    <th scope="col">{order?.orderStatus}</th>
                    <th>
                      <button
                        disabled={order?.orderStatus !== "Ordered"}
                        style={{
                          backgroundColor:
                            order.orderStatus !== "Ordered" ? "grey" : "red",
                          border: "1px solid white",
                          color: "white", // Change text color as needed
                        }}
                        className="danger-button"
                        onClick={() =>
                          handleOrderCancel(order._id, "Cancelled")
                        }
                      >
                        <CancelIcon />
                      </button>
                      <button
                        disabled={order.orderStatus !== "Ordered"}
                        style={{
                          backgroundColor:
                            order.orderStatus !== "Ordered" ? "grey" : "green",
                          border: "1px solid white",
                          color: "white", // Change text color as needed
                        }}
                        onClick={()=>setOrder(order._id)}
                        className="danger-button"
                        data-toggle="modal" data-target="#exampleModal"
                      >
                        <DoneIcon />
                      </button>
                    </th>
                    <th scope="col">{order.paymentId?.status}</th>
                    <th scope="col">
                      <div>
                        <button
                          disabled={
                            !(
                              order.orderStatus === "Approved" ||
                              order.orderStatus === "Ordered" ||
                              order.orderStatus === "Cancelled"
                            )
                          }
                          style={{
                            backgroundColor:
                              order.orderStatus === "Ordered" ||
                              order.orderStatus === "Approved" ||
                              (order.orderStatus === "Cancelled" &&
                                order.paymentId.status === "refunded") ||
                              order.orderStatus !== "Cancelled"
                                ? "grey"
                                : "green",
                            border: "1px solid white",
                            color: "white", // Change text color as needed
                          }}
                          className="danger-button"
                          onClick={() =>
                            handleRefund(order.paymentId._id, "Approved")
                          }
                          
                        >
                          Initiate Refund{" "}
                        </button>
                      </div>
                    </th>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                 Assign Delivery
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <div className="address-content">
                {delivery && delivery.map((d,index)=>{
                    return(
                        <div className="form-check"> 
                          <input type="radio" className="form-check-input form-check-inputValue address1" name="address"  value={index} onChange={()=>handleSelect(index)} checked={index == selectedDelivery }/>         
                         <label class="form-check-label label1" htmlFor="address1">  
                       <div className="addressContent">
                       <p><strong>Name: </strong>{d.firstName} {d.lastName}</p>
                       <p><strong>Mobile Number : </strong>{d.phoneNumber}</p>
                       <p><strong>Address:</strong></p>
                        {d.address[0].street} Street, {d.address[0].city}, {d.address[0].state}, {d.address[0].country}, {d.address[0].pincode}

                       </div>
                    </label>
                    </div>
                    
                    )
                })  
                }
              </div>
              <div className="modal-footer">
                <button type="button" class="btn btn-primary" onClick={handleAssign}>
                  Assign Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
}

export default AdminOrders;
