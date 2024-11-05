import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the Notification interface to describe the structure of notification objects
interface Notification {
    first_name: string;
    type: 'comment' | 'reaction' | 'reply' | 'share';
    content: string;
    created_at: string;
    image: string;
}

const Notification: React.FC = () => {
    // Use the Notification interface in the useState hook
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

    useEffect(() => {
        // Fetch notifications when the component mounts
        const userId = localStorage.getItem('user_id');
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/notifications/${userId}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationMenuToggle = () => {
        setNotificationMenuOpen(prev => !prev);
    };

    return (
        <>
            <div className="navbar-notification" onClick={handleNotificationMenuToggle}>
                <i className="fa-solid fa-bell"></i>
                <span className="notification-count">{notifications.length}</span>
            </div>

            {notificationMenuOpen && (
    <div className="notification-menu">
        {notifications.map((notification, index) => (
            <div className="notification-item" key={index}>
                <div className="notification-content">
                    <div className="notification-row">  {/* Added a wrapper with flexbox */}
                        {notification.image && (
                            <img
                                src={`http://localhost:8081/uploads/${notification.image}`}
                                style={{
                                    width: '40px',
                                    borderRadius: '50%',
                                    height: '40px',
                                    objectFit: 'cover',
                                    marginRight: '10px'
                                }}
                                alt="user"
                            />
                        )}
                        <div>
                            <strong>{notification.first_name}</strong> {notification.type === 'comment' && 'commented on your post: '}
                            {notification.type === 'reaction' && `reacted to your post (${notification.content}): `}
                            {notification.type === 'reply' && 'replied to your comment: '}
                            {notification.type === 'share' && 'shared your post: '}
                            <span>{notification.content}</span>
                            <span className="notification-time">{new Date(notification.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <a href="#" className="see-all">See All Notifications</a>
    </div>
)}

        </>
    );
};

export default Notification;
