import React, { useEffect, useState } from 'react';
import '../css/OrderReceipt.css'; // Import the CSS for 
import davaopetworldlogo from  '../images/davao-petworld-logo.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface OrderDetails {
    order_id: number;
    created_at: string;
    product_name: string;
    product_quantity: number;
    total_price: number;
    payment_method: string;
    shipping_fee: number;
    email: string;
    full_name: string;
    address: string;
}

const OrderReceipt: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get order ID from URL
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Fetch order details by ID
        axios
            .get(`${apiUrl}api/order/${id}`)
            .then((response) => {
                setOrderDetails(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!orderDetails) {
        return <div>No order details found.</div>;
    }

    const { created_at, product_name, product_quantity, total_price, payment_method, shipping_fee, email, full_name, address } = orderDetails;

    return (
        <div className="receipt-container">
            <header className="receipt-header">
                <div className="header-row">
                    <div className="logo">
                        <img src={davaopetworldlogo} alt="Davao Pet World Logo" />
                    </div>
                    <div className="order-title">
                        <h3>ORDER RECEIPT</h3>
                    </div>
                </div>
                <hr />
                <div className="company-info">
                    <h2>DAVAO PET WORLD</h2>
                    <p>C. Bangoy St, Poblacion District,</p>
                    <p>Davao City, Davao del Sur</p>
                    <p>OWNER: MERCY CHUA</p>
                </div>
                <hr />
                <div className="order-info">
                    <p><strong>DATE:</strong> {new Date(created_at).toLocaleDateString()}</p>
                    <p><strong>Order #:</strong> {id}</p>
                </div>
            </header>
            <hr />

            <section className="customer-details">
                <h3>CUSTOMER DETAILS</h3>
                <p><strong>Full Name:</strong> {full_name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Address:</strong> {address}</p>
            </section>
            <hr />
            <section className="order-details1">
                <h3>ORDER DETAILS</h3>
                <div className="receipt-table">
    <table>
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Shipping Fee</th>
                <th>Total Price</th>
                <th>Payment Method</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{product_name}</td>
                <td>{product_quantity}</td>
                <td>₱{shipping_fee.toFixed(2)}</td>
                <td>₱{new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2 }).format(total_price)}</td>
                <td>{payment_method}</td>
            </tr>
        </tbody>
    </table>
</div>

            </section>

            <footer>
                <button className="print-button" onClick={() => window.print()}>
                    Print Receipt
                </button>
            </footer>
        </div>
    );
};

export default OrderReceipt;
