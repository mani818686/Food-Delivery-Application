import { useNavigate } from "react-router-dom";
import "./home.css";
function Home() {
  const navigate = useNavigate();

  const handleCategory=(category)=>{
      navigate("/menu")
  }

  return (
    <div className="home-container">
     <div>
      
      {/* Landing Page Content */}
      <div className="my-5">
        <h1 className="mb-4">Discover our Food Items</h1>

        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="mb-3">Our Web Application</h2>
            <p>
            Our platform offers a seamless food experience. With a decentralized system, we ensure fast, reliable, and global delivery options for everyone. Dive into the future of food technology.
            </p>
            <button  onClick={handleCategory} className="btn btn-dark">See Menu</button>
          </div>
          <div className="col-md-6">
            <img src="food.png" alt="Food Items" className=" border-0 img-fluid" />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;
