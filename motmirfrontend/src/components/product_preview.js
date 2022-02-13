import './styles/product_preview.css'
import { AiFillCloseCircle } from 'react-icons/ai'

const ProductPreview = ({ product, cart, setCart, setShowPrev}) => {
  const imgAlt = 'text';

  const handleAddToCart = (e) => {
    e.preventDefault();
    const tmpproduct = product;
    tmpproduct.quantity = parseInt(e.target.elements.quantity.value);
    const tmpcart = cart;
    for (const [index, p] of tmpcart.entries()) {
      if (p.id === product.id) {
        tmpproduct.quantity += Object.prototype.hasOwnProperty.call(tmpcart[index], 'quantity') ? tmpcart[index].quantity : 0;
        tmpcart.splice(index, 1);
        break;
      }
    }
    tmpcart.push(tmpproduct);
    setCart(tmpcart);
    console.log(cart);
  }

  return (
    <div className="productPreviewOverlay">
      <div className="productPreview">
        <AiFillCloseCircle className="exitPreviewbtn" onClick={(e) => {setShowPrev(false);e.stopPropagation()}}/>
        <img src="https://www.toomore.ma/wp-content/uploads/2020/04/Aziza.jpg" alt={imgAlt} className="productPreviewImg" width="400" height="400"/>
        <div className="infoHeader">
          <h2>{product.name}</h2>
          <p>{product.price} USD/KG</p>
        </div>
        <div className="infoBody">
          <p><b>Organic:</b> {product.organic <= 0 ? 'No' : 'Yes'}</p>
          <p><b>Description:</b> {product.description}</p>
        </div>
        <form onSubmit={handleAddToCart}>
          <input type="number" defaultValue="1" name="quantity" min="1" max="20" required="required"/>
          <input type="submit" value="Add to Cart"/>
        </form>
      </div>
    </div>
  )
}

export default ProductPreview;
