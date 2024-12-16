import React, { useEffect, useState } from 'react';
import '../css/OrderReceipt.css';
import davaopetworldlogo from '../images/davao-petworld-logo.png';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface OrderDetails {
    order_id: number;
    created_at: string;
    product_name: string;
    product_quantity: string;
    product_id: string; // Assuming product_id is part of the order details
    total_price: number;
    payment_method: string;
    shipping_fee: number;
    email: string;
    full_name: string;
    address: string;
    product_price: number;
    sub_total: number;
    transaction_id: string;
}

const OrderReceipt: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios
            .get(`${apiUrl}api/order/${id}`)
            .then((response) => {
                const fetchedOrderDetails = response.data;
                setOrderDetails(fetchedOrderDetails);
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

    const {
        created_at,
        product_name,
        product_quantity,
        total_price,
        payment_method,
        shipping_fee,
        email,
        full_name,
        address,
        sub_total,
        product_price,
        transaction_id
    } = orderDetails;

    // Split product names and quantities into arrays
    const productNames = product_name.split(',');
    const productQuantities = product_quantity.split(',').map((qty) => parseInt(qty.trim()));

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
                    <p><strong>Transaction #:</strong> {transaction_id}</p>
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
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productNames.map((name, index) => {
                                const quantity = productQuantities[index];
                                const price_quantity = (product_price * quantity).toFixed(2);

                                return (
                                    <tr key={index}>
                                        <td>{name.trim()}</td>
                                        <td>{quantity}</td>
                                        <td>₱{price_quantity}</td>
                                    </tr>
                                );
                            })}

                        

                            {/* Subtotal Row */}
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'right' }}><strong>Subtotal</strong></td>
                                <td colSpan={1}>
                                    <strong>₱{sub_total ? sub_total.toFixed(2) : '0.00'}</strong>
                                </td>
                            </tr>

                            {/* Optional: If you want to show the shipping fee separately */}
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'right' }}><strong>Shipping Fee</strong></td>
                                <td colSpan={1}><strong>₱{shipping_fee.toFixed(2)}</strong></td>
                            </tr>

                            {/* Adding Total Row */}
                            <tr>
                                <td colSpan={2} style={{ textAlign: 'right' }}><strong>Total</strong></td>
                                <td colSpan={1}>
                                    <strong>₱{total_price.toFixed(2)}</strong>
                                </td>
                            </tr>

                                {/* Payment method Row */}
                                <tr>
                                <td colSpan={2} style={{ textAlign: 'right' }}><strong>Payment Method</strong></td>
                                <td colSpan={1}>
                                    <strong>{payment_method.trim()}</strong>
                                </td>
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
