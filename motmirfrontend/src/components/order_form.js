import './styles/order_form.css'
import { baseUrl } from '../index.js'
import { getToken } from './common';

const OrderForm = ({setShowOrderForm, cart, setCart, totalQuantity, totalPrice}) => {
  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    const fullOrder = {};
    for (const elem of elements) {
      if (elem.name !== "") {
        fullOrder[elem.name] = elem.value;
      }
    };
    fullOrder['ordered_products'] = Object.values({...cart});
    console.log(fullOrder['ordered_products']);
    fullOrder['total_quantity'] = totalQuantity;
    fullOrder['total_price'] = totalPrice;
    fullOrder['shipping_cost'] = 100
    sendOrder(fullOrder)
      .then(blob => {
        alert('Placed Order Successfully');
        setCart([]);
        localStorage.removeItem("cart");
      })
      .catch(e => {console.log(e);alert('Failed to Place Order')});
    setShowOrderForm(false);
  }

  const sendOrder = async (data) => {
    const token = getToken();
    let response = await fetch(baseUrl + '/api/orders',
                {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers: {'Content-Type': 'application/json; charset=UTF-8', 'x-access-token': token}
                })
    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  }

  return (
    <div id="orderFormOverlay" onClick={(e) => {e.stopPropagation();setShowOrderForm(false)}}>
      <div id="orderForm" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleOrderSubmit}>
            <h3>Shipping address</h3>

            <label htmlFor="full_name"><i className="fa fa-user"></i> Full Name</label>
            <input type="text" id="full_name" name="full_name" placeholder="John M. Doe" required="required"/>

            <label htmlFor="email"><i className="fa fa-envelope"></i> Email</label>
            <input type="email" id="email" name="email" placeholder="john@example.com" required="required"/>

            <label htmlFor="phone_number"><i className="fa fa-phone"></i> Phone Number</label>
            <input type="text" id="phone_number" name="phone_number" placeholder="+212611223344" required="required"/>


            <label htmlFor="country"><i className="fa fa-flag"></i> Country</label>
            <input type="text" id="country" name="country" placeholder="United states of America" required="required"/>

            <label htmlFor="state">State</label>
            <input type="text" id="state" name="state" placeholder="NY" required="required"/>

            <label htmlFor="city"><i className="fa fa-institution"></i> City</label>
            <input type="text" id="city" name="city" placeholder="New York" required="required"/>

            <label htmlFor="full_address"><i className="fa fa-address-card-o"></i> Address</label>
            <input type="text" id="full_address" name="full_address" placeholder="542 W. 15th Street" required="required"/>

            <label htmlFor="zip_code">Zip Code (Code Postal)</label>
            <input type="number" id="zip_code" name="zip_code" placeholder="10001" required="required"/>

            <label htmlFor="payment_method">Choose a payment method:</label>
            <select id="payment_method" name="payment_method" required="required">
              <option value="on delivery">Payment on delivery</option>
            </select>

            <input type="submit" value="Place Order" id="orderFormSubmitBtn"/>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
