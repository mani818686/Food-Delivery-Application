import { useEffect, useState } from "react";
import "./index.css";
import { useParams } from "react-router-dom";
import { getData, postData } from "../../http-post-service";
import EditIcon from "@mui/icons-material/Edit";

function ProductDetails() {
  const { productId } = useParams(); 
  const [productDetails, setProductDetails] = useState({});
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(0);

  const handleUpdatePrice = async () => {
    const updatedProduct = {
      ...productDetails,
        price:price
    };
    setShow(false);
    try {
      let response = await postData(
        "/foodItem/updatePrice/" + productDetails._id,
        JSON.stringify({ price: price })
      );
      if (response.message === "price updated successfully") {
        setProductDetails(updatedProduct);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await getData(`/foodItem/${productId}`);
        setProductDetails(data.products[0]);
        console.log(data.products[0]);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    getOrderDetails();
  }, []);

  const handleEdit = (id, price) => {
    setShow(id);
    setPrice(price);
  };

  return (
    <div className="product-container">
      <h2>FoodItem Details</h2>
      {console.log(productDetails.Category?.categoryName)}
      <h2>Name : {productDetails.name}</h2>
      <img
        width="300px"
        height="300px"
        src={"/uploads/" + productDetails.image}
        // src="https://picsum.photos/seed/picsum/200/300"
        alt={productDetails.name}
      />
      <p>Description: {productDetails.description}</p>
      <p>Category: {productDetails.Category?.categoryName}</p>
      <p>Price : {productDetails.price} </p>
      <p>
        <button
          className="button-edit"
          style={{ marginLeft: "30px" }}
          onClick={() => handleEdit(productDetails._id)}
        >
          <EditIcon />
        </button> 
        </p>

      {show && (
        <div className="my-container">
          <div className="form-group">
            <label htmlFor="email" className="head">
              Price
            </label>
            <input
              type="email"
              className="form-control-item-lists"
              value={price}
              id="email"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <button
            className="active"
            style={{ marginLeft: "30px" }}
            onClick={handleUpdatePrice}
          >
            Update Price
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
