import './styles/order.css';
import PayPal from './PayPal';
import { secureGetToken, getUserDetails } from './common';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { baseUrl } from '..';
import axios from 'axios';


const Order = ({setShowOrder, cart, setCart, totalQuantity, totalPrice}) => {
  const [payOnDelivery, setPayOnDelivery] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [shippingCost, setShippingCost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const calculateShippingCost = async () => {
    const token = secureGetToken();
    //check if token still available and not expired
    if(!token) {
      navigate("/login");
    }

    await axios.post(baseUrl + '/api/shipping_cost',
                     {'quantity': totalQuantity},
                     {
                       headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'x-access-token': token}
                     }
                    )
    .then(response => {
      setShippingCost(response.data.shipping_cost);
    })
    .catch(error => {
      setError('Something went wrong while trying to calculate shipping cost.');
      setShippingCost(null);
    });
  }

  const handlePOD = (e) => {
    // pay on delivery handler
    e.preventDefault();
    // add a check if user still connected
    const fullOrder = {};
    fullOrder['ordered_products'] = Object.values({...cart});
    fullOrder['total_quantity'] = totalQuantity;
    fullOrder['total_price'] = totalPrice;
    fullOrder['payment_method'] = 'on delivery';
    if(!shippingCost) {
      fullOrder['shipping_cost'] = 0;
    } else {
      fullOrder['shipping_cost'] = parseInt(shippingCost);
    }

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
    const token = secureGetToken();
    //check if token still available and not expired
    if(!token) {
      navigate("/login");
    }

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

    calculateShippingCost();

  }, []);

  return (
    <div id="orderOverlay" onClick={(e) => {e.stopPropagation();setShowOrder(false)}}>
      <div id="order" onClick={(e) => e.stopPropagation()}>

        <h3>Payment</h3>

        {error ? <h4>{error}</h4> : <></>}

        <p><strong>Shipping Cost : </strong> {shippingCost ? shippingCost + " USD" : "calculating..."}</p>

        {shippingCost ? <p><strong>Total Price : </strong>{shippingCost + totalPrice} USD</p> : <></>}

        {payOnDelivery ?
          <button onClick={handlePOD} >Pay On Delivery</button>
        :
          <></>
        }

        <button onClick={() => {setCheckout(true)}}>Pay Using Paypal</button>

        {checkout ?
          <PayPal setCheckout={setCheckout} cart={cart} setCart={setCart} shippingCost={shippingCost} totalPrice={totalPrice} totalQuantity={totalQuantity} setShowOrder={setShowOrder} />
        :
          <></>
        }

      </div>
    </div>
  );
}

export default Order;
