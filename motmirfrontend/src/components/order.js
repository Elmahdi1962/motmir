import './styles/order.css'
import { secureGetToken, getToken, getUserDetails } from './common';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { baseUrl } from '..';


const Order = ({setShowOrder, cart, setCart, totalQuantity, totalPrice}) => {
  const [payOnDelivery, setPayOnDelivery] = useState(false);
  const navigate = useNavigate();

  const handlePOD = (e) => {
    e.preventDefault();
    const fullOrder = {};
    fullOrder['ordered_products'] = Object.values({...cart});
    fullOrder['total_quantity'] = totalQuantity;
    fullOrder['total_price'] = totalPrice;
    fullOrder['payment_method'] = 'on delivery';
    fullOrder['shipping_cost'] = 100

    sendOrder(fullOrder)
      .then(blob => {
        alert('Placed Order Successfully');
        setCart([]);
        localStorage.removeItem("cart");
      })
      .catch(e => {console.log(e);alert('Failed to Place Order')});

    setShowOrder(false);

  }


  const sendOrder = async (data) => {
    const token = getToken();
    let response = await fetch(baseUrl + '/api/user/order',
                {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers: {'Content-Type': 'application/json; charset=UTF-8', 'x-access-token': token}
                })
    if (!response.ok){
      throw new Error(`HTTP error while trying to send Order! status: ${response.status}`);
    }
    return await response.blob();
  }


  useEffect(() => {
    const token = secureGetToken();
    if(!token) {navigate('/login');}

    getUserDetails()
    .then(response => {
      if(response.data.data.country.toLowerCase() === 'morocco') {
        setPayOnDelivery(true);
      } else {
        setPayOnDelivery(false);
      }
    })
    .catch(error => {
      setPayOnDelivery(false);
      alert("Please fill your shipping address details first.")
      navigate('/account/shipping_address');
    });
  }, []);

  return (
    <div id="orderOverlay" onClick={(e) => {e.stopPropagation();setShowOrder(false)}}>
      <div id="order" onClick={(e) => e.stopPropagation()}>

        <h3>Payment</h3>

        {payOnDelivery ?
        <button onClick={handlePOD} >Pay On Delivery</button>
        : <></>}
        <button disabled={true}>Pay Using Paypal</button>

      </div>
    </div>
  );
}

export default Order;
