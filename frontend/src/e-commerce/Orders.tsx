import React, { useEffect, useState } from 'react';
import '../css/orders.css';
import { Link } from 'react-router-dom';

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  product_name: string;
  product_price: number;
  product_quantity: string;
  payment_method: string;
  total_price: number;
  status: string;
  transaction_id: string;
  created_at: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}api/orders?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    

    fetchOrders();
  }, [userId]);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US'); // Formats the date as MM/DD/YYYY
  };

  return (
    <div className="orders-container">
      <h1>Track Orders</h1>
      <div className="table-responsive">
        <table  className='admin-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Transaction Id</th>
              <th>Full Name</th>
              <th>Order date</th>
              <th>Product Name</th>
              <th>Product Qty</th>
              <th>Payment Method</th>
              <th>Order Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td data-label="ID">{order.id}</td>
                <td data-label="ID">{order.transaction_id}</td>
                <td data-label="Full Name">{order.first_name} {order.last_name}</td>
                <td data-label="Order Date">{formatDate(order.created_at)}</td>
                <td data-label="Product Name">{order.product_name}</td>
                <td data-label="Product Qty">{order.product_quantity}</td>
                <td data-label="Payment Method">{order.payment_method}</td>
                <td data-label="Total Price">₱{order.total_price}</td>
                <td data-label="Status">
                  {order.status === 'Delivered' ? (
                    <span className="status-delivered">{order.status}</span>
                  ) : order.status === 'Cancelled' ? (
                    <span className="status-cancelled">{order.status}</span>
                  ) : order.status === 'On delivery' ? (
                    <span className="status-ondelivery">{order.status}</span>
                  ) : (
                    <span className="status-pending">{order.status}</span>
                  )}
                </td>
                <td style={{ width: '15%' }}>

                      <Link 
                        to={`/order_receipt/${order.id}`}
                        className="view-btn" 
                        style={{ textDecoration: 'none' }}>
                        <i className="fas fa-eye"></i>View Order
                      </Link>
                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="pagination">
        <div className="container1">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              style={{
                cursor: 'pointer',
                margin: '0 5px',
                fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
                textDecoration: currentPage === index + 1 ? 'underline' : 'none',
              }}
            >
              {index + 1}
            </span>
          ))}
          {currentPage < totalPages && (
            <span onClick={() => setCurrentPage(currentPage + 1)} style={{ cursor: 'pointer' }}>
              <i className="bx bx-right-arrow-alt"></i>
            </span>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;
