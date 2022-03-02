import '../styles/orders.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureGetToken } from '../common';
import axios from 'axios';
import { baseUrl } from '../..';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {

    const token = secureGetToken();

    if(!token) {
      navigate('/login');
      return;
    }

    axios.get(baseUrl + "/api/orders", {
      headers: {
        'x-access-token': token
      }
    })
    .then(response => {
      if(response.data.length <= 0) {
        setError("There is no orders.");
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

  }, [navigate]);

  return (
      <div className="admin-orders-container">

        {error ? <p>{error}</p> : <></>}

        {orders.map(order => 
          <div className="admin-order-item" key={order.order_number}>
            <p className="admin-order-item-text"><strong>Id : </strong>{order.id}</p>
            <p className="admin-order-item-text"><strong>Order Number : </strong>{order.order_number}</p>
            <p className="admin-order-item-text"><strong>Total Quantity : </strong>{order.total_quantity}</p>
            <p className="admin-order-item-text"><strong>Total Price : </strong>{order.total_price}</p>
            <p className="admin-order-item-text"><strong>Shipping Cost : </strong>{order.shipping_cost}</p>
            <p className="admin-order-item-text"><strong>Payment Method : </strong>{order.payment_method}</p>
            <p className="admin-order-item-text"><strong>Payed : </strong>{order.payed}</p>
            <p className="admin-order-item-text"><strong>Status : </strong>{order.status}</p>
          </div>
        )}

      </div>
  )
}

export default Orders