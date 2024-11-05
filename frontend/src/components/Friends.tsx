import React from 'react';
import { Link } from 'react-router-dom';
import friends from '../images/friends.png';
import news from '../images/news.png';
import marketplace from '../images/marketplace.png';
// import member_1 from '../images/member-1.png';
import '../css/friends.css'

const Friends = () => {
  return (
    <div className="container">
      <div className="sidebar-left">
        <div className="imp-links">
          <a href="/"><img src={news} alt="News" />Latest News</a>
          <a href="/friends"><img src={friends} alt="Friends" />Friends</a>
          <Link to="/ecommerce" className="link">
            <img src={marketplace} alt="Store" />
            Store 
          </Link>
        </div>
      </div>

      <div className="main-content1">
        <div className="sidebar-title">
          <h4>Friend Requests</h4>
        </div>

        <div className="friend-cards-container">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
            <div className="friend-card" key={index}>
              <div className="friend-card-img">
                {/* <img src={index % 2 === 0 ? member_1 : member_1} alt="Profile Image" /> */}
              </div>
              <div className="friend-card-info">
                <h4>{index % 2 === 0 ? 'John Doe' : 'Jane Smith'}</h4>
                <p><i className="fa fa-user"></i>{index % 2 === 0 ? '2 mutual friends' : '5 mutual friends'}</p>
                <button className="confirm-btn">Confirm</button>
                <button className="decline-btn">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
