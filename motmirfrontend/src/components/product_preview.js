import './styles/product_preview.css'
import { AiFillCloseCircle } from 'react-icons/ai'
import { baseUrl } from '../index.js'

const ProductPreview = ({ product, cart, setCart, setShowPrev}) => {
  const imgAlt = 'text';

  const handleAddToCart = (e) => {
    e.preventDefault();
    const tmpproduct = product;
    tmpproduct.quantity = parseInt(e.target.elements.quantity.value);
    const tmpcart = [...cart];
    for (const [index, p] of tmpcart.entries()) {
      if (p.id === product.id) {
        tmpproduct.quantity += Object.prototype.hasOwnProperty.call(tmpcart[index], 'quantity') ? tmpcart[index].quantity : 0;
        tmpcart.splice(index, 1);
        break;
      }
    }
    tmpproduct.total_price = (tmpproduct.quantity * tmpproduct.price);
    tmpcart.push(tmpproduct);
    e.target.addtocart.value = 'Added Successfully';
    e.target.addtocart.style.backgroundColor = 'rgb(40, 172, 43)';
    setCart(tmpcart);
  }

  return (
    <div id="productPreviewOverlay" onClick={(e) => {e.stopPropagation();setShowPrev(false);}}>
      <div id="productPreview" onClick={(e) => e.stopPropagation()}>
        <AiFillCloseCircle className="exitPreviewbtn" onClick={(e) => {e.stopPropagation();setShowPrev(false);}}/>
        <img src={baseUrl +'/api/images/'+ product.img_url} alt={imgAlt} className="productPreviewImg" width="400" height="400"/>
        <div className="infoHeader">
          <h2>{product.name}</h2>
          <p>{product.price} USD/KG</p>
        </div>
        <div className="infoBody">
          <p><b>Organic:</b> {product.organic <= 0 ? 'No' : 'Yes'}</p>
          <p><b>Description:</b> {product.description}</p>
        </div>
        <form onSubmit={handleAddToCart}>
          <input type="number" defaultValue="1" name="quantity" min="1" max="20" required="required" onChange={() => {document.getElementById("addtocart").setAttribute("value", "Add more");document.getElementById("addtocart").style.backgroundColor = 'rgb(56, 168, 253)';}}/>
          <input type="submit" value="Add to Cart" id="addtocart"/>
        </form>
      </div>
    </div>
  )
}

export default ProductPreview;
