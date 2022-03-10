import React, { useEffect, useRef } from 'react';

function PayPal() {
  const paypal = useRef();

  useEffect(() => {
    window.paypal.Buttons({
      createOrder: (data, actions, err) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: "aziza",
              amount: {
                currency_code: "MAD",
                value: 150.00
              }
            }
          ]
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log("successfull order!", order);
      },
      onError: (err) => {
        console.log(err);
      }
    }).render(paypal.current)
  }, []);
  return (
    <div>
      <div ref={paypal}></div>
    </div>
  )
}

export default PayPal
