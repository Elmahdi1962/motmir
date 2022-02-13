//import './styles/product_list.css';
import { baseUrl } from '../index.js'
import { useEffect, useState } from 'react';

const ProductList = (handleSideBarBtnClick) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch(baseUrl + 'api/products')
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          // print error
          const error = response.statusText;
          return Promise.reject(error);
        }
        setProducts(data);
      })
      .catch(error => {
        console.log('there was an error when fetching products list : ', error);
      });

  }, []);

  return (
    <div className="productList">
      <h1>Available Products</h1>
      {products.map((value, index) => {
        return (
          <div className="productItem" key={index}>
            <img src="https://www.toomore.ma/wp-content/uploads/2020/04/Aziza.jpg" alt="image of aziza dates" className="productItemImg" width="200" height="200"/>
            <div className="itemInfo">
              <h2 className="productName">{value.name}</h2>
              <p className="productPrice">{value.price} USD/KG</p>
            </div>
          </div>
        )
      })}
    </div>
  );
}

export default ProductList;