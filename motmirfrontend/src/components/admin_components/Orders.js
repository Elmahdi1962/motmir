import '../styles/orders.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureGetToken } from '../common';
import axios from 'axios';
import { baseUrl } from '../..';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [showUpdateForm, setShowUpdateFrom] = useState(false);
  const navigate = useNavigate();


  const handleOrderDelete = (e) => {
    e.preventDefault();
    const token = secureGetToken();
    if(!token) {
      navigate('/login');
      return;
    }

    axios.delete(baseUrl + '/api/orders/' + e.target.getAttribute('data-orderid'),
                {
                  headers: {
                    'x-access-token': token
                  }
                })
    .then(response => {
      setFlash('Deleted The Order Successfully.');
      window.location.reload();
    })
    .catch(error => {
      if(error.response) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong.');
      }
    })
  }

  const handleOrderUpdate = (e) => {
    e.preventDefault();
    const token = secureGetToken();
    if(!token) {
      navigate('/login');
      return;
    }

    const formdata = new FormData(e.target);

    axios.put(baseUrl + '/api/orders/' + orderId, formdata,
                {
                  headers: {
                    'x-access-token': token
                  }
                })
    .then(response => {
      setFlash('Updated The Order Successfully.');
      window.location.reload();
    })
    .catch(error => {
      if(error.response) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong.');
      }
    })
  }


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
      <div className="admin-orders-section">

        {error ? <p>{error}</p> : <></>}
        {flash ? <p>{flash}</p> : <></>}

        <div className="admin-orders-container">
          {orders.map(order => 
            <div className="admin-order-item" key={order.order_number}>

              <div className="orderdropdown">
                <button className="orderdropbtn"><i className="fa-solid fa-caret-down"></i></button>
                <div className="orderdropdown-content">
                  <button data-orderid={order.id} onClick={handleOrderDelete}>Delete</button>
                  <button data-orderid={order.id} onClick={(e) => {e.stopPropagation(); setShowUpdateFrom(true); setOrderId(e.target.getAttribute('data-orderid'));}}>Update</button>
                </div>
              </div>

              <p className="admin-order-item-text"><strong>Id : </strong>{order.id}</p>
              <p className="admin-order-item-text"><strong>Order Number : </strong>{order.order_number}</p>
              <p className="admin-order-item-text"><strong>Total Quantity : </strong>{order.total_quantity}</p>
              <p className="admin-order-item-text"><strong>Total Price : </strong>{order.total_price}</p>
              <p className="admin-order-item-text"><strong>Shipping Cost : </strong>{order.shipping_cost}</p>
              <p className="admin-order-item-text"><strong>Payment Method : </strong>{order.payment_method}</p>
              <p className="admin-order-item-text"><strong>Payed : </strong>{order.payed ? 'Yes' : 'No'}</p>
              <p className="admin-order-item-text"><strong>Status : </strong>{order.status}</p>
            </div>
          )}
        </div>

        {showUpdateForm ?
          <div className="order-update-form-container" onClick={(e) => {e.stopPropagation(); setShowUpdateFrom(false)}} >
            <form className="order-update-form" onSubmit={handleOrderUpdate} onClick={(e) => {e.stopPropagation();}}>
              <div className="order-form-update-field">
                <label htmlFor="payed">Payed</label>
                <input type="checkbox" name="payed" />
              </div>

              <div className="order-form-update-field">
                <label htmlFor="status">Status</label>
                <select name="status">
                  <option value="" selected disabled >As it is</option>
                  <option value="Pending">Pending</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Awaiting Fulfillment">Awaiting Fulfillment</option>
                  <option value="Awaiting Shipment">Awaiting Shipment</option>
                  <option value="Awaiting Pickup">Awaiting Pickup</option>
                  <option value="Partially Shipped">Partially Shipped</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Declined">Declined</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Partially Refunded">Partially Refunded</option>
                  <option value="Disputed">Disputed</option>
                  <option value="Manual Verification Required">Manual Verification Required</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <input type="submit" value="Update"/>
            </form>
          </div>
        :
          <></>
        }

      </div>
  )
}

export default Orders