import React, { useState, useEffect } from 'react';
import logo from '../images/davao-petworld-logo.png';
 import '../css/admin.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import Sidebar from '../admin/Sidebar'
import axios from 'axios';


// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );

const Dashboard: React.FC = () => {
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});
    const apiUrl = import.meta.env.VITE_API_URL;

    
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (profileDropdownVisible && !target.closest('.profile')) {
        setProfileDropdownVisible(false);
      }
      Object.keys(menuDropdownVisible).forEach(key => {
        if (menuDropdownVisible[key] && !target.closest(`.menu[data-key="${key}"]`)) {
          setMenuDropdownVisible(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDropdownVisible, menuDropdownVisible]);

  const [chartDataPosts, setChartDataPosts] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Post Count',
        data: [],
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
      }
    ]
  });

  // Array of month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Fetch data using useEffect
  useEffect(() => {
    axios.get(`${apiUrl}fetch_post`)
      .then((response) => {
        console.log("Response data:", response.data); // Debugging
        const data = response.data;
        
        // Create an object to store the post count by month (ignoring year)
        const postCountByMonth: number[] = Array(12).fill(0); // Array with 12 zeros for each month

        data.forEach((item: any) => {
          // Extract the month from created_at
          const date = new Date(item.created_at);
          const month = date.getMonth(); // Month index (0-11)

          // Increment the count for this month
          postCountByMonth[month] += 1;
        });

        // Prepare labels (months) and post counts
        const labels = monthNames; // "Jan", "Feb", etc.
        const postCounts = postCountByMonth; // Array with counts for each month

        // Set the chart data
        setChartDataPosts({
          labels: labels,
          datasets: [
            {
              label: 'Post Count',
              data: postCounts,
              borderColor: '#FF5733',
              backgroundColor: 'rgba(255, 87, 51, 0.2)',
              fill: true,
            }
          ]
        });
      })
      .catch((error) => {
        console.error('Error fetching post data:', error);
      });
  }, []);

  const chartOptionsPosts: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Post Count'
        }
      }
    }
  };


  




  
  const [sellerUserData, setSellerUserData] = useState<ChartData<'bar'>>({
    labels: ['Users', 'Sellers'], // Predefined labels for categories
    datasets: [{
      label: 'Count',
      data: [], // Data will be dynamically set
      backgroundColor: ['#4caf50', '#ff9800'], // Green for Users, Orange for Sellers
      borderColor: ['#388e3c', '#f57c00'], // Darker shades for borders
      borderWidth: 1
    }]
  });
  

  useEffect(() => {
    axios.get(`${apiUrl}no_seller_user`)
      .then(response => {
        const { users, sellers } = response.data; // Destructure counts from the API response
        setSellerUserData(prevState => ({
          ...prevState,
          datasets: [{
            ...prevState.datasets[0],
            data: [users, sellers] // Set counts for Users and Sellers
          }]
        }));
      })
      .catch(error => {
        console.error('Error fetching user and seller counts:', error);
      });
  }, []);
  

  const chartComparisonOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Roles (Users and Sellers)'
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        },
      }
    }
  };
  


  const [adminProfile, setAdminProfile] = useState<{ image: string; first_name: string; last_name: string } | null>(null);


  useEffect(() => {
      const adminId = localStorage.getItem('admin_id'); // Retrieve the admin ID from local storage
  
      if (adminId) {
          // Fetch admin profile data using the updated endpoint
          fetch(`${apiUrl}admin/${adminId}`) // Adjusted endpoint to fetch by ID
              .then(res => {
                  if (!res.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return res.json();
              })
              .then(data => setAdminProfile(data[0] || null)) // Assuming the response is an array
              .catch(err => console.log(err));
      } else {
          console.log("Admin ID not found in local storage");
      }
  }, []);


  const [counts, setCounts] = useState({
    userCount: 0,
    sellerCount: 0,
    postCount: 0,
  });

  useEffect(() => {
    // Fetching all the counts from the server
    const fetchCounts = async () => {
      try {
        const [users, products, orders] = await Promise.all([
          axios.get(`${apiUrl}no_user`),
          axios.get(`${apiUrl}no_seller`),
          axios.get(`${apiUrl}no_post`),
        ]);
        
        setCounts({
          userCount: users.data.user_count,
          sellerCount: products.data.seller_count,
          postCount: orders.data.post_count,
        });
      } catch (error) {
        console.error("Error fetching counts", error);
      }
    };

    fetchCounts();
  }, []);



  
  

  return (
    <div>
      <section id="sidebar" className={sidebarHidden ? 'hide' : ''}>
        <img 
          src={logo} 
          alt="Logo" 
          className="logo" 
          style={{
            height: 'auto',
            width: '90%',
            verticalAlign: 'middle',
            margin: '0 auto',
            display: 'flex'
          }} 
        />
       
       <Sidebar/>
      </section>

      <section id="content">
        <nav>
        <i
            className='bx bx-menu toggle-sidebar'
            onClick={() => setSidebarHidden(prev => !prev)}
          ></i>
          <span className="divider"></span>
          <div className="profile" style={{ marginLeft: '94%', position: 'absolute' }}>
            {adminProfile && ( // Ensure adminProfile is not null
              <>
                <img
                  src={`${apiUrl}uploads/${adminProfile.image}`} // Use dynamic image
                  alt="Profile"
                  onClick={() => setProfileDropdownVisible(prev => !prev)}
                />
                <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                  <li style={{ marginBottom: '5px', marginLeft: '15px', marginTop: '20px' }}>
                    <h1 style={{ fontSize: '12px', margin: 0 }}>Welcome: {adminProfile.first_name}</h1>
                  </li>
                  <li style={{ marginBottom: '5px' }}>
                    <Link to={`/admin_profile/${localStorage.getItem('admin_id')}`} style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}>
                        <i className='bx bxs-user-circle' style={{ marginRight: '5px' }}></i> Profile
                    </Link>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ textDecoration: 'none', color: '#333', display: 'flex', alignItems: 'center' }}
                    onClick={() => {
                      // Clear local storage
                      localStorage.clear();
                      
                      // Redirect to the login page or another account page
                      window.location.href = '/login'; // Adjust this path as necessary
                    }}
                  >
                    <i className='bx bxs-log-out-circle' style={{ marginRight: '5px' }}></i> Logout
                  </a>
                </li>
                </ul>
              </>
            )}
          </div>
        </nav>

        <main>
          <h1>Dashboard</h1>
          <ul className="breadcrumbs">
            <li><a href="#">Home</a></li>
            <li className="divider">/</li>
            <li><a href="#" className="active">Dashboard</a></li>
          </ul>
          <div className="info-data">
                <div className="card">
              <div className="head">
                <div>
                  <h2>{counts.userCount}</h2>
                  <p>No of Users</p>
                </div>
                <i className='bx bx-user icon'></i>
              </div>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2>{counts.sellerCount}</h2>
                  <p>No of Sellers</p>
                </div>
                <i className='bx bx-user-plus icon'></i>
              </div>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2>{counts.postCount}</h2>
                  <p>No of Post</p>
                </div>
                <i className='bx bx-shopping-bag icon down'></i>
              </div>
            </div>

            
          </div>

          <div className="data">
          <div className="content-data">
            <div className="chart">
              <Line data={chartDataPosts} options={chartOptionsPosts} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>Monthly counts of Post</h3>
          </div>

     

          <div className="content-data">
  <div className="chart">
    <Bar data={sellerUserData} options={chartComparisonOptions} />
  </div>
  <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>
    Comparison of Users and Sellers
  </h3>
</div>


          </div>


  





        </main>
      </section>
    </div>
  );
}

export default Dashboard;
