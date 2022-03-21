import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Paypal.css';
import { PayPalButton } from "react-paypal-button-v2";
import { secureGetToken } from './common';
import { baseUrl } from '..';

function PayPal({setCheckout, cart, setCart, shippingCost, totalPrice, totalQuantity, setShowOrder}) {
  const navigate = useNavigate();
  const [purchaseUnits, setPurchaseUnits] = useState([]);


  const handlePOP = (transaction_id) => {
    // pay on paypal handler
    const fullOrder = {};
    fullOrder['ordered_products'] = Object.values({...cart});
    fullOrder['total_quantity'] = totalQuantity;
    fullOrder['total_price'] = totalPrice;
    fullOrder['payment_method'] = 'Paypal';
    fullOrder['paid'] = 1;
    fullOrder['status'] = 'Awaiting Payment';
    fullOrder['order_number'] = transaction_id.toString();
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
    .catch(e => {console.log(e);alert('Failed to Place Order, But Paid successfully.\n Contact Us for a refund.')});

    setCheckout(false);
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
    //check if token still available and not expired
    if(!token) {
      navigate("/login");
    }

    const total_price = totalPrice + shippingCost;
    const units = [
      {
        "description": "Dattes from Motmir",
        "amount": {
          "value": total_price.toString() + ".00",
          "currency_code": "USD",
          "breakdown": {
            "item_total": {
              "currency_code": "USD",
              "value": totalPrice.toString() + ".00"
            },
            "shipping": {
              "currency_code": "USD",
              "value": shippingCost.toString() + ".00"
            }
          }
        },
        "items": []
      }
    ];

    for(let product of Object.values({...cart})) {
      units[0].items.push({
        "name": product.name,
        "quantity": product.quantity.toString(),
        "unit_amount": {
          "currency_code": "USD",
          "value": product.price.toString()
        }
      });
    }

    setPurchaseUnits(units);
  }, [cart]);

  return (
    <div className="payal-container" onClick={(e) => {setCheckout(false); e.stopPropagation();}}>
      <div className="paypal-button" onClick={(e) => {e.stopPropagation();}}>
        <PayPalButton
          createOrder={(data, actions) => {
            if(purchaseUnits.length <= 0) {
              alert("Cart Items still loading! try again in 3 seconds");
              return;
            }
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: purchaseUnits,
            });
          }}

          options={{
            clientId: "AZMo7IuNhBEc3g-KqrnLaGkpwGa5omIxeuX5A8YNTipvRqBdwenHwdKRzvUMROGzfynQnws3kR9GOT_Z",
            currency: "USD",
            intent: "capture"
          }}

          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              alert("Transaction completed by " + details.payer.name.given_name);
              handlePOP(details.purchase_units[0].payments.captures[0].id)
            });
          }}

          catchError={(error) => {
            alert("Transaction Failed!");
            console.log('Transaction Failed Error : ', error);
          }}
        />
      </div>
    </div>
  )
}

export default PayPal
