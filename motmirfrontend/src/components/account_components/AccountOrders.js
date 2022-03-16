import "../styles/AccountOrders.css";
import { useState, useEffect } from 'react';
import { baseUrl, imagesUrl } from "../..";
import axios from "axios";
import { getToken } from "../common";


function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    const token = getToken();

    axios.get(baseUrl + "/api/user/orders", {
      headers: {
        'x-access-token': token
      }
    })
    .then(response => {
      if(response.data.length <= 0) {
        setError("You have no orders.");
      }
      setOrders(response.data);
    })
    .catch(error => {
      if(error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something wrong happened!");
      }
    });

  }, []);
  return (
    <div className="account_orders_container">

      {error ? <h3>{error}</h3> : <></>}

      {orders.map((order, index) => 
        <div className="account_order_item" key={order.order_number}>

          <div className="orders_text_blocks">
            <p><b>Order Number : </b> {order.order_number}</p>
            <p><b>Created At : </b> {order.created_at.split(".")[0]}</p>
            <p><b>Total Price : </b> {order.total_price} USD</p>
            <p><b>Total Quantity : </b> {order.total_quantity} Kg</p>
            <p><b>Shipping Cost : </b> {order.shipping_cost} USD</p>
            <p><b>Payment Method : </b> {order.payment_method}</p>
            <p><b>Payed : </b> {order.payed ? "Yes" : "No"}</p>
            <p><b>Status : </b> {order.status}</p>
          </div>

          <div className="account_ordered_products">
            <h3>Ordered Products: </h3>

            <div className="ordered_products_container">
              {order.orders_details.map((product, index) =>
                <div className="ordered_products_items" key={product.name + toString(index)}>
                  <img src={imagesUrl + "tr:w-600/products-images/" + product.img_name} alt={product.img_name}  width="70px" height="70px" />
                  <p><b>Name : </b> {product.name}</p>
                  <p><b>Price : </b> {product.price}</p>
                  <p><b>Quantity : </b> {product.quantity}</p>
                  <p><b>Total Price : </b> {product.total_price}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default AccountOrders