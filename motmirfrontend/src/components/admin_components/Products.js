import '../styles/products.css';
import { baseUrl } from '../../index.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken, secureGetToken } from '../common';
import { FaBuromobelexperte } from 'react-icons/fa';


function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

  const handleProductAdding = (e) => {
    e.preventDefault();
    const token = secureGetToken();
    // if token expired then redirect to login page
    if(!token) {
      navigate('/login');
      return;
    }

    const formdata = new FormData(e.target)
    if(formdata.get('img_name').name.length >= 59) {
      setError('File name is too long');
      return;
    }

    axios.post(baseUrl + '/api/products', formdata,{
      headers: {
        'x-access-token': token
      }
    })
    .then(response => {
      setFlash('Added Product successfully')
      setError(null);
      getProducts();
    })
    .catch(error => {
      if(error.response) {
        setFlash(null);
        setError(error.response.data.message);
      } else {
        setFlash(null);
        setError('Something went wrong! try again.');
      }
    });
  }


  const getProducts = () => {
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
  }

  useEffect(() => {

    getProducts();

  }, []);

  return (
    <div className="productscontainer">

      {flash ? <p>{flash}</p> : <></>}

      <form className="productform" onSubmit={handleProductAdding}>
        <label htmlFor="img_name">Choose an Image</label>
        <input type="file" name="img_name" required="required"/>

        <label htmlFor="name">Name</label>
        <input type="text" name="name" required="required"/>

        <label htmlFor="price">Price</label>
        <input type="number" name="price" required="required"/>
        
        <label htmlFor="organic">Organic</label>
        <input type="checkbox" name="organic"/>

        <label htmlFor="description">Description</label>
        <textarea name="description"  maxLength="900"  required="required"/>

        <input type="submit" value="add product"/>
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