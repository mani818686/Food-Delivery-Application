import { useState } from 'react'
import axios from "axios";
import "./addproducts.css";
import { useNavigate } from 'react-router-dom';
import { postData } from '../../http-post-service';

function Addproducts() {

  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    "name": "",
    "description": "",
    "size": "",
    "color": "",
    "brandName": "",
    "categoryName": "Men's Top Wear",
    "image": "",
    "price":""
  })

  const handleFileChange = (event) => {
    setProductData((data) => ({
      ...data,
      "image": event.target.files[0].name
    }))
    // handleFileUpload(event.target.files[0])
  };

  const handleFileUpload = (fileData) => {
    if (fileData) {
      const formData = new FormData();
      formData.append('image', fileData);

      axios.post('http://localhost:5001/upload', formData)
        .then((result) => {
          console.log(result)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  };
  const handleAddProduct = async() => {

    console.log(productData)
    let response = await postData("/product/addProduct",JSON.stringify(productData))
    console.log(response)
    if(response.message =='Product created successfully'){
      navigate("/admin/dashboard")
    }
    
  }
  const handleData = (column, e) => {
    setProductData((data) => ({
      ...data,
      [column]: e.target.value
    }))

  }
  return (
    <div className='login-container-item'>
      <h5 className='text-center'><u>Add Products</u></h5>
        <div className="form-group">
          <label htmlFor="name" className="head">Product Name</label>
          <input type="text" className="form-control-styles" id="name" onChange={(e) => handleData('name', e)} />
        </div>
      <div className="form-group">
        <label htmlFor="desc" className="head">Product Description</label>
        <input type="text" className="form-control-styles" id="desc" onChange={(e) => handleData('description', e)} />
      </div>
      
      <div className="form-group">
        <label htmlFor="image" className="head">Upload Product Image</label>
        <input type="file" className="form-control-styles" accept="image/png, image/gif, image/jpeg" id="image" onChange={handleFileChange} />
      </div>
      <div className="form-group">
        <label htmlFor="size" className="head">Category</label>
        <select class="form-control-styles" onChange={(e) => handleData("categoryName", e)}>
          <option value="Men's Top Wear">Men's Top Wear</option>
          <option value="Men's Bottom Wear">Men's Bottom Wear</option>
          <option value="Women's Ethnic">Women's Ethnic</option>
          <option value="Women's Western">Women's Western</option>
          <option value="Men's Footwear"> Men's Footwear</option>
          <option value="Women's Footwear">Women's Footwear</option>
          <option value="Kids Wear">Kids Wear</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="brand" className="head">Brand Name</label>
        <input type="text" className="form-control-styles" id="brand" onChange={(e) => handleData('brandName', e)} />
      </div>

      <div className="form-group size">
        <label htmlFor="size" className="head">Size(s) (give in comma seperated)</label>
        <input type="text" className="form-control-styles" id="size" onChange={(e) => handleData('size', e)} />
      </div>
      <div className="form-group size">
        <label htmlFor="price" className="head">Price(s) (give in comma seperated)</label>
        <input type="text" className="form-control-styles" id="price" onChange={(e) => handleData('price', e)} />
      </div>
      <div className="form-group size">
        <label htmlFor="color" className="head">Color(s) (give in comma seperated)</label>
        <input type="text" className="form-control-styles" id="color" onChange={(e) => handleData('color', e)} />
      </div>

      <button className="btn-color" onClick={handleAddProduct} >Add Product</button>
    </div>
  )
}

export default Addproducts;
