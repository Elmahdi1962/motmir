import './styles/product_item.css'
import ProductPreview from './product_preview';
import { useState} from 'react';
import { baseUrl } from '../index.js'

const ProductItem = ({product, cart, setCart}) => {
  const imgAlt = `image of ${product.name} dates`;
  const [showPrev, setShowPrev] = useState(false);

  return (
    <div className="productItem" onClick={() => setShowPrev(true)}>
      <img src={baseUrl +'/api/images/'+ product.img_name} alt={imgAlt} className="productItemImg" width="200"/>
      <div className="itemInfo">
        <h2 className="productName">{product.name}</h2>
        <p className="productPrice">{product.price} USD/KG</p>
      </div>
      {showPrev === true ? <ProductPreview product={product} cart={cart} setCart={setCart} setShowPrev={setShowPrev}/> : <></>}
    </div>
  )
}

export default ProductItem;