import '../styles/products.css';
import { baseUrl } from '../../index.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../common';


function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {

    const token = getToken();
    axios.get(baseUrl + "/api/products/full",{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then(response => {
      setProducts(response.data);
    })
    .catch(error => {
      console.log(error);
      setError(error.response.data.message);
    });

  }, []);

  return (
    <div className="productscontainer">
      <form className="productform">
        <label htmlFor="img_name">Choose an Image</label>
        <input type="file" name="img_name" required="required"/>

        <label htmlFor="name">Name</label>
        <input type="text" name="name" required="required"/>

        <label htmlFor="price">Price</label>
        <input type="number" name="price" required="required"/>
        
        <label htmlFor="organic">Organic</label>
        <input type="checkbox" name="organic" required="required"/>

        <label htmlFor="description">Description</label>
        <textarea name="description"  maxLength="900" />

        <input type="submit" value="add product" required="required"/>
      </form>

      {error !== '' ? <p>{error}</p> : <></>}

      <div className="productitemscontainer">
        {products.map(product => 
        <div className="productitm" key={product.id}>

          <img src={baseUrl + "/api/images/" + product.img_name} alt={"picture of " + product.name} width="50px" height="50px" />

          <div className="pinfoblocks">
            <p><b>Name : </b> {product.name}</p>
          </div>

          <div className="pinfoblocks">
            <p><b>Price : </b> {product.price}</p>
          </div>

          <div className="pinfoblocks">
            <p><b>Organic : </b> {product.organic}</p>
          </div>

          <div className="pinfoblocks">
            <p><b>Id : </b> {product.id}</p>
          </div>

          <div className="pinfoblocks">
            <p><b>Created_at : </b> {product.created_at}</p>
          </div>

          <div className="pinfoblocks">
            <p><b>Updated_at : </b> {product.updated_at}</p>
          </div>

        </div>
        )}
      </div>
    </div>
  )
}

export default Products