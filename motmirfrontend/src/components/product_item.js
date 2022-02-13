import './styles/product_item.css'

const ProductItem = ({product, index}) => {
  const imgAlt = `image of ${product.name} dates`;

  return (
    <div className="productItem" key={index}>
      <img src="https://www.toomore.ma/wp-content/uploads/2020/04/Aziza.jpg" alt={imgAlt} className="productItemImg" width="200" height="200"/>
      <div className="itemInfo">
        <h2 className="productName">{product.name}</h2>
        <p className="productPrice">{product.price} USD/KG</p>
      </div>
    </div>
  )
}

export default ProductItem;