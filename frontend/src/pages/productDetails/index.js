import { useEffect, useState } from "react";
import "./index.css";
import { useParams } from "react-router-dom";
import { getData, postData } from "../../http-post-service";
import EditIcon from "@mui/icons-material/Edit";

function ProductDetails() {
  const { productId } = useParams(); // Get the order ID from the URL parameter
  const [productDetails, setProductDetails] = useState([]);
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState(0);

  const handleUpdatePrice = async() => {
    const variantId = show;
    const updatedProduct = {
      ...productDetails,
      variantId: productDetails.variantId.map((variant) =>
        variant._id === variantId
          ? { ...variant, price: +(price) }
          : variant
      ),
    };
    setShow(false);
    try{
        let response = await postData("/product/updatePrice/"+productDetails._id+"/"+show,JSON.stringify({price:price}))
        if(response.message === "Variant price updated successfully"){
            setProductDetails(updatedProduct);
        }
    }
    catch(e){
        console.log(e)
    }
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const data = await getData(`/product/${productId}`);
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
      <h2>Product Details</h2>
      <h2>Name : {productDetails.name}</h2>
      <img
        width="300px"
        height="300px"
        src={"/uploads/" + productDetails.image}
        alt={productDetails.name}
      />
      <p>Description: {productDetails.description}</p>
      <p>Category: {productDetails.categoryId?.categoryName}</p>
      <p>Brand: {productDetails.brandId?.brandName}</p>
      <h3>Variants:</h3>
      <div>
        {productDetails?.variantId &&
          productDetails?.variantId.map((variant, index) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div key={variant._id}>
                {index + 1} : Size: {variant.size}, Color: {variant.color},
                Price: ${variant.price}
              </div>
              <div>
                <button
                className="btn btn-primary"
                  style={{ marginLeft: "30px" }}
                  onClick={() => handleEdit(variant._id)}
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          ))}

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
              className="btn-Color"
              style={{ marginLeft: "30px" }}
              onClick={handleUpdatePrice}
            >
              Update Price
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
