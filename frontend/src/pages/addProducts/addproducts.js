import { useState } from 'react'
import axios from "axios";

function Addproducts() {

  const [productData, setProductData] = useState({
    "name": "",
    "description": "",
    "size": "",
    "color": "",
    "brandName": "",
    "categoryName": "Men's Top Wear",
    "image": ""
  })

  const handleFileChange = (event) => {
    setProductData((data) => ({
      ...data,
      "image": event.target.files[0].name
    }))
    handleFileUpload(event.target.files[0])
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
  const handleAddProduct = () => {

    console.log(productData)
    axios.post('http://localhost:5001/api/product/addProduct', productData)
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.error(error)
      })
  }
  const handleData = (column, e) => {
    setProductData((data) => ({
      ...data,
      [column]: e.target.value
    }))
  }
  return (
    <div className='container mt-5 d-flex flex-column justify-content-center align-items-center border p-4'>
      <h5 className='text-center'>Add Products</h5>
      <div className='row'>
        <div className="col">
          <label htmlFor="name" className="form-label">Product Name</label>
          <input type="text" className="form-control" id="name" onChange={(e) => handleData('name', e)} />
        </div>
      </div>

      <div className="mb-3 col-4">
        <label htmlFor="desc" className="form-label">Product Description</label>
        <input type="text" className="form-control" id="desc" onChange={(e) => handleData('description', e)} />
      </div>
      <div className="mb-3 col-4">
        <label htmlFor="image" className="form-label">Upload Product Image</label>
        <input type="file" className="form-control" accept="image/png, image/gif, image/jpeg" id="image" onChange={handleFileChange} />
      </div>
      <div className="mb-3 col-4">
        <label htmlFor="price" className="form-label">Price</label>
        <input type="text" className="form-control" id="price" onChange={(e) => handleData('price', e)} />
      </div>
      <div className="mb-3 col-4">
        <label htmlFor="size" className="form-label">Category</label>
        <select class="form-select" onChange={(e) => handleData("categoryName", e)}>
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
      <div className="mb-3 col-4">
        <label htmlFor="brand" className="form-label">Brand Name</label>
        <input type="text" className="form-control" id="brand" onChange={(e) => handleData('brandName', e)} />
      </div>
      <div className="mb-3 col-4">
        <label htmlFor="size" className="form-label">Size</label>
        <input type="text" className="form-control" id="size" onChange={(e) => handleData('size', e)} />
      </div>
      <div className="mb-3 col-4">
        <label htmlFor="color" className="form-label">Color</label>
        <input type="text" className="form-control" id="color" onChange={(e) => handleData('color', e)} />
      </div>

      <button className="btn btn-primary" onClick={handleAddProduct} >Add Product</button>
    </div>
  )
}

export default Addproducts;
