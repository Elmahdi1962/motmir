import '../styles/OrdersDetails.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureGetToken } from '../common';
import axios from 'axios';
import { baseUrl } from '../..';


function OrdersDetails() {
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {

    const token = secureGetToken();

    if(!token) {
      navigate('/login');
      return;
    }

    axios.get(baseUrl + "/api/orders_details", {
      headers: {
        'x-access-token': token
      }
    })
    .then(response => {
      if(response.data.length <= 0) {
        setError("There is no Orders Details.");
      }
      setOrdersDetails(response.data);
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
      <div className="admin-orders-details-container">

        {error ? <p>{error}</p> : <></>}

        {ordersDetails.map(orderDetail => 
          <div className="admin-orders-details-item" key={orderDetail.id}>
            <p className="admin-orders-details-item-text"><strong>Id : </strong>{orderDetail.id}</p>
            <p className="admin-orders-details-item-text"><strong>Product Id : </strong>{orderDetail.product_id}</p>
            <p className="admin-orders-details-item-text"><strong>Order Id : </strong>{orderDetail.order_id}</p>
            <p className="admin-orders-details-item-text"><strong>Quantity : </strong>{orderDetail.quantity}</p>
            <p className="admin-orders-details-item-text"><strong>Total Price : </strong>{orderDetail.total_price}</p>
          </div>
        )}

      </div>
  )
}

export default OrdersDetails