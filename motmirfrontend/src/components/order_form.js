import './styles/order_form.css'
import { baseUrl } from '../index.js'
import { useState } from 'react'

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
    fullOrder['orderedProducts'] = [...cart];
    fullOrder['totalQuantity'] = totalQuantity;
    fullOrder['totalPrice'] = totalPrice;
    sendOrder(fullOrder)
      .then(blob => {alert('Placed Order Successfully'); setCart([]);})
      .catch(e => {console.log(e);alert('Failed to Place Order')});
    setShowOrderForm(false);
  }

  const sendOrder = async (data) => {
    let response = await fetch(baseUrl + '/api/orders',
                {
                  method: 'POST',
                  body: data,
                  headers: {'Content-type': 'application/json; charset=UTF-8'}
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

            <label htmlFor="fname"><i className="fa fa-user"></i> Full Name</label>
            <input type="text" id="fname" name="fullname" placeholder="John M. Doe" required="required"/>

            <label htmlFor="email"><i className="fa fa-envelope"></i> Email</label>
            <input type="email" id="email" name="email" placeholder="john@example.com" required="required"/>

            <label htmlFor="phonenumber"><i className="fa fa-phone"></i> Phone Number</label>
            <input type="text" id="phonenumber" name="phonenumber" placeholder="+212611223344" required="required"/>


            <label htmlFor="country"><i className="fa fa-flag"></i> Country</label>
            <input type="text" id="country" name="country" placeholder="United states of America" required="required"/>

            <label htmlFor="state">State</label>
            <input type="text" id="state" name="state" placeholder="NY" required="required"/>

            <label htmlFor="city"><i className="fa fa-institution"></i> City</label>
            <input type="text" id="city" name="city" placeholder="New York" required="required"/>

            <label htmlFor="adr"><i className="fa fa-address-card-o"></i> Address</label>
            <input type="text" id="adr" name="address" placeholder="542 W. 15th Street" required="required"/>

            <label htmlFor="zipcode">Zip Code (Code Postal)</label>
            <input type="number" id="zipcode" name="zipcode" placeholder="10001" required="required"/>

            <label htmlFor="payment">Choose a payment method:</label>
            <select id="payment" name="payment" required="required">
              <option value="on delivery">Payment on delivery</option>
            </select>

            <input type="submit" value="Place Order" id="orderFormSubmitBtn"/>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
