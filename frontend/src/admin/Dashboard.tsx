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
import PaymentMethodChart from './PaymentMethodChart';

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


  
  
  const [chartDataRevenue, setChartDataRevenue] = useState<ChartData<'line'>>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Revenue',
            data: [],
            borderColor: '#FF5733',
            backgroundColor: 'rgba(255, 87, 51, 0.2)',
            fill: true,
        }
    ]
});

const chartOptionsRevenue: ChartOptions<'line'> = {
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
                text: 'Cash Value'
            }
        }
    }
};

useEffect(() => {
    const fetchRevenueData = async () => {
        try {
            const response = await fetch(`${apiUrl}revenue_sales`); // Adjust the URL based on your API path
            const data = await response.json();

            // Prepare the revenue data for the chart
            const revenueData = new Array(12).fill(0); // Initialize an array with 0s for each month

            data.forEach((item: { month: number; total_revenue: any; }) => {
                const monthIndex = item.month - 1; // Month is 1-based in SQL, adjust to 0-based
                revenueData[monthIndex] = item.total_revenue; // Assign total revenue to the respective month index
            });

            // Update the chart data
            setChartDataRevenue((prev) => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: revenueData,
                }]
            }));
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    };

    fetchRevenueData();
}, []);
  
  const [categoryData, setCategoryData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [{
      label: 'Count',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1
    }]
  });

  useEffect(() => {
    axios.get(`${apiUrl}no_products`)
      .then(response => {
        const labels = response.data.map((item: { category_name: any; }) => item.category_name);  // Extract category names
        const data = response.data.map((item: { count: any; }) => item.count);            // Extract counts

        // Generate random colors for each category dynamically
        const backgroundColor = labels.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);
        const borderColor = backgroundColor;

        setCategoryData({
          labels: labels,
          datasets: [{
            label: 'Count',
            data: data,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1
          }]
        });
      })
      .catch(error => {
        console.error('There was an error fetching the category data:', error);
      });
  }, []);

  const chartComparisonOptionsCategories: ChartOptions<'bar'> = {
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
          text: 'Categories'
        },
        stacked: false,
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        },
        stacked: false,
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
    productCount: 0,
    orderCount: 0,
    categoryCount: 0,
  });

  useEffect(() => {
    // Fetching all the counts from the server
    const fetchCounts = async () => {
      try {
        const [users, products, orders, categories] = await Promise.all([
          axios.get(`${apiUrl}no_user`),
          axios.get(`${apiUrl}no_product`),
          axios.get(`${apiUrl}no_order`),
          axios.get(`${apiUrl}no_category`)
        ]);
        
        setCounts({
          userCount: users.data.user_count,
          productCount: products.data.product_count,
          orderCount: orders.data.order_count,
          categoryCount: categories.data.category_count,
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
                  <h2>{counts.productCount}</h2>
                  <p>No of Products</p>
                </div>
                <i className='bx bx-store-alt icon'></i>
              </div>
            </div>
            <div className="card">
              <div className="head">
                <div>
                  <h2>{counts.orderCount}</h2>
                  <p>No of Orders</p>
                </div>
                <i className='bx bx-shopping-bag icon down'></i>
              </div>
            </div>

            <div className="card">
              <div className="head">
                <div>
                  <h2>{counts.categoryCount}</h2>
                  <p>No of Categories</p>
                </div>
                <i className='bx bx-category icon'></i>
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
              <Line data={chartDataRevenue} options={chartOptionsRevenue} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>Revenue Sales Per Month</h3>
          </div>

          <div className="content-data">
            <div className="chart">
            <Bar data={categoryData} options={chartComparisonOptionsCategories} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>Comparison of Product Categories</h3>
          </div>

          <div className="content-data">
      <div className="chart">
        <PaymentMethodChart />
      </div>
    </div>

          </div>


  





        </main>
      </section>
    </div>
  );
}

export default Dashboard;
