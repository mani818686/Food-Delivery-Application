import { useEffect, useState } from 'react'
import axios from 'axios'
import "./products.css"

function Products({ category }) {

  const [products, setproducts] = useState([])

  useEffect(() => {
    let url = "http://localhost:5001/api/product/products"
    if (category) {
      url = url += "?categoryName=" + category
    }

    axios.get(url)
      .then((result) => {
        console.log(result)
        setproducts(result.data.products)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return (
    <div className='products-container'>
      <div className="filters">
        filter
      </div>
      <div className="products mt-5">
        {
          products && products?.map((product) => {
            return (
              <>
                <div className="Card">
                  <div className="image imgText">
                    <img width="300px" height="300px" alt={product.name} src={"/uploads/" + product.image} />
                  </div>
                  <div className="productBrand">
                    <div className="product">
                      <h5 className='brand-name'>{product.brandId.brandName}</h5>
                      <div className='product-name'>{product.name}</div>
                    </div>

                    <div className='info'>
                      <div className="left">
                        <div>Price :  $ {product.price}</div>
                        <div className='color'>Color : {product.variantId.color}</div>
                      </div>
                      <div className="right">
                        <div className='size'>Size : {product.variantId.size}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })
        }
      </div >
    </div>
  )
}

export default Products
