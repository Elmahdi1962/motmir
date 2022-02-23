import '../styles/products.css'

function Products() {
  return (
    <div className="productscontainer">
      <form className="productform">
        <label for="img_name">Choose an Image</label>
        <input type="file" name="img_name" required="required"/>

        <label for="name">Name</label>
        <input type="text" name="name" required="required"/>

        <label for="price">Price</label>
        <input type="number" name="price" required="required"/>
        
        <label for="organic">Organic</label>
        <input type="checkbox" name="organic" required="required"/>

        <label for="description">Description</label>
        <textarea name="description"  maxlength="900" />

        <input type="submit" value="add product" required="required"/>
      </form>
    </div>
  )
}

export default Products