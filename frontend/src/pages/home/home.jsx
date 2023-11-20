import "./home.css"
import { useNavigate} from "react-router-dom"
function Home({handleSelectedCategory}) {

    const navigate = useNavigate();

    const handleCategory=(category)=>{
        handleSelectedCategory(category)
        navigate("/products")
    }

    return (
        <div className='home-container'>
            <div className="categories-card">
                <div className="cards">
                    <h5 className="title">Mens Top Wear</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="Mens Top Wear" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button className="link" onClick={(e)=>handleCategory("Men's Top Wear")}>See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Mens Bottom Wear</h5>
                    <div className="image">
                        <img src="mens_bottomwear.jpeg" alt="Mens Bottom Wear" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link" onClick={(e)=>handleCategory("Men's Bottom Wear")}>See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Womens Ethnic</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="Womens Ethnic"  width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link"  onClick={(e)=>handleCategory("Women's Ethnic")} >See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Womens Western</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="Womens Western" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link" onClick={(e)=>handleCategory("Women's Western")} >See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Mens FootWear</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="Mens Footwear" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link" onClick={(e)=>handleCategory("Men's Footwear")} >See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Womens FootWear</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="WoMens Footwear" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link" onClick={(e)=>handleCategory("Women's Footwear")}>See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Kids Wear</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="Kids wear" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link" onClick={(e)=>handleCategory("Kids Wear")} >See more</button>
                    </div>
                </div>
                <div className="cards">
                    <h5 className="title">Accessories</h5>
                    <div className="image">
                        <img src="topwear.jpeg" alt="Accessories" width="300px" height="320px" />
                    </div>
                    <div className="more">
                        <button  className="link" onClick={(e)=>handleCategory("Accessories")}>See more</button>
                    </div>
                </div>
            </div>
               
        </div>
    )
}

export default Home
