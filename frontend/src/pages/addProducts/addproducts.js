import { useEffect, useState } from "react";
import axios from "axios";
import "./addproducts.css";
import { useNavigate } from "react-router-dom";
import { getData, postData } from "../../http-post-service";

function Addproducts() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    categoryName: "",
    image: "",
    price: "",
    category:""
  });
  const [category, setCategory] = useState([]);
  console.log(category)
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    console.log(show);
    setShow((p) => !p);
  };

  useEffect(() => {
    const fetchData = async () => {
      let url = "/foodItem/category";

      try {
        const result = await getData(url);
        console.log(result);
        setCategory(result.categories);
        setProductData((p)=>({...p,categoryName:result.categories[0]._id}))
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (event) => {
    handleFileUpload(event.target.files[0]);
    setProductData((data) => ({
      ...data,
      image: event.target.files[0].name,
    }));
  };

  const handleFileUpload = (fileData) => {
    if (fileData) {
      const formData = new FormData();
      formData.append("image", fileData);

      axios
        .post("http://localhost:5001/upload", formData)
        .then((result) => {
          console.log(result);
          // setProductData()

        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleAddCategory = async () => {
    let response = await postData(
      "/foodItem/addCategory",
      JSON.stringify({name:productData.category})
    );
    console.log(response);
   
    if (response.message == "Category created successfully") {
      setCategory((p)=>[...p,response.product])
      toggleShow()
    }
  };

  const handleAddProduct = async () => {
    console.log(productData);
    let response = await postData(
      "/foodItem/add/"+productData.categoryName,
      JSON.stringify(productData)
    );
    console.log(response);
    if (response.message == "FoodItem created successfully") {
      navigate("/admin/dashboard");
    }
  };
  const handleData = (column, e) => {
    setProductData((data) => ({
      ...data,
      [column]: e.target.value,
    }));
  };
  return (
    <>
      <h5 className="text-center float-end m-5">
        <button type="button" class="active p-1" onClick={toggleShow}>
          Add Food Category
        </button>
      </h5>
      {!show && (
        <div className="login-container-item">
          <h2 className="text-center">Add Food Item</h2>
          <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
          <div className="form-group">
            <label htmlFor="name" className="head">
              FoodItem Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              onChange={(e) => handleData("name", e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="desc" className="head">
              FoodItem Description
            </label>
            <input
              type="text"
              className="form-control"
              id="desc"
              onChange={(e) => handleData("description", e)}
            />
          </div>

          <div >
            <label htmlFor="image">
              Upload FoodItem Image
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/png, image/gif, image/jpeg"
              id="image"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="size" className="head">
              Category
            </label>
            <select
              class="form-control"
              onChange={(e) => handleData("categoryName", e)}
            >
              {category &&
                category.map((c) => {
                  return <option value={c._id}>{c.categoryName}</option>;
                })}
            </select>
          </div>
          <div className="form-group size">
            <label htmlFor="price" className="head">
              Price
            </label>
            <input
              type="text"
              className="form-control"
              id="price"
              onChange={(e) => handleData("price", e)}
            />
          </div>

          <button className="active" onClick={handleAddProduct}>
            Add Food Item
          </button>
        </div>
        </div>
        </div>
        </div>
        </div>
      )}
      {show && (
         <div className="container">
        <div className="form-group">
          <label htmlFor="desc" className="head">
            Category
          </label>
          <input
            type="text"
            className="form-control"
            id="desc"
            onChange={(e) => handleData("category", e)}
          />
        </div>
        <button className="active" onClick={handleAddCategory}>
            Add Category
          </button>
        </div>
      )}
    </>
  );
}

export default Addproducts;
