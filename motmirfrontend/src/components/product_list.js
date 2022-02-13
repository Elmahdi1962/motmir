import './styles/product_list.css';
import { baseUrl } from '../index.js'
import { useEffect, useState } from 'react';
import ProductItem from './product_item.js';

const ProductList = ({ cart, setCart}) => {
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
    <section className="productList">
      <h2>Available Products</h2>

      <div className="productListItemsContainer">
        {products.map((value, index) =>
          <ProductItem product={value} cart={cart} setCart={setCart} key={index}/>
        )}
      </div>

    </section>
  );
}

export default ProductList;