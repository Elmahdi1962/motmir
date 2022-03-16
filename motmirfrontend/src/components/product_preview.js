import './styles/product_preview.css'
import { AiFillCloseCircle } from 'react-icons/ai'
import { imagesUrl } from '../index.js'
import { useState, useEffect } from 'react'

const ProductPreview = ({ product, cart, setCart, setShowPrev}) => {
  const imgAlt = 'text';
  const [addToCart, setAddToCart] = useState('Add to Cart')

  useEffect(() => {
    if(addToCart === 'Add More') {
      document.getElementById("addtocart").style.backgroundColor = 'rgb(56, 168, 253)'
    }
  }, [addToCart])

  const handleAddToCart = (e) => {
    e.preventDefault();
    const newCart = {...cart};

    if(!(product.id in cart)){
      newCart[product.id] = {...product, quantity: 0};
    }
    newCart[product.id].quantity += parseInt(e.target.elements.quantity.value);

    /* save cart in local storage in case client refreshes the page */
    if(localStorage.getItem("cart")) {
      localStorage.removeItem("cart");
    }
    localStorage.setItem("cart", JSON.stringify(newCart));

    setCart(newCart);
    setAddToCart("Added Successfully");
    e.target.addtocart.style.backgroundColor = 'rgb(40, 172, 43)';
  }

  return (
    <div id="productPreviewOverlay" onClick={(e) => {e.stopPropagation();setShowPrev(false);}}>
      <div id="productPreview" onClick={(e) => e.stopPropagation()}>

        <AiFillCloseCircle className="exitPreviewbtn" onClick={(e) => {e.stopPropagation();setShowPrev(false);}}/>
        <img src={imagesUrl +'products-images/'+ product.img_name} alt={imgAlt} className="productPreviewImg" width="500" height="500"/>
        <div id="product-preview-info">

          <div className="infoHeader">
            <h2>{product.name}</h2>
            <p>{product.price} USD/KG</p>
          </div>
          <div className="infoBody">
            <p><b>Organic:</b> {product.organic <= 0 ? 'No' : 'Yes'}</p>
            <p><b>Description:</b> {product.description}</p>
          </div>
          <form onSubmit={handleAddToCart}>
            <input type="number" defaultValue="1" name="quantity" min="1" max="20" required="required" onChange={() => {addToCart === 'Added Successfully' ? setAddToCart('Add More') : setAddToCart('Add to Cart')}}/>
            <input type="submit" value={addToCart} id="addtocart"/>
          </form>

        </div>

      </div>
    </div>
  )
}

export default ProductPreview;
