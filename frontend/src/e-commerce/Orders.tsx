import React, { useEffect, useState } from 'react';
import '../css/orders.css';

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
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const apiUrl = import.meta.env.VITE_API_URL;
  const userId = 1; // Replace with dynamic user ID from authentication context or props

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${apiUrl}api/orders?user_id=${userId}`);
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

  return (
    <div className="orders-container">
      <h1>Track Orders</h1>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Product Name</th>
              <th>Product Qty</th>
              <th>Payment Method</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td data-label="ID">{order.id}</td>
                <td data-label="First Name">{order.first_name}</td>
                <td data-label="Last Name">{order.last_name}</td>
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
