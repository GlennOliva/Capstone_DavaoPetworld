import React, { useState, useEffect } from 'react';
import logo from '../images/logo1.png';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

// Register Chart.js components
// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    BarElement
  );

const Dashboard: React.FC = () => {
    const [sidebarHidden, setSidebarHidden] = useState<boolean>(false);
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false);
    const [menuDropdownVisible, setMenuDropdownVisible] = useState<Record<string, boolean>>({});

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

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Series 1',
        data: [1200, 1500, 1700, 1600, 1800, 1900, 2200, 2100, 2000, 2300, 2500, 2400],
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
      },
      {
        label: 'Series 2',
        data: [900, 1100, 1300, 1200, 1400, 1500, 1700, 1600, 1500, 1800, 1900, 1700],
        borderColor: '#33C1FF',
        backgroundColor: 'rgba(51, 193, 255, 0.2)',
        fill: true,
      }
    ]
  };
  
  const chartOptions: ChartOptions<'line'> = {
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
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
  
  const chartComparison: ChartData<'bar'> = {
    labels: ['Betta Splenders', 'Guppy', 'Gold Fish', 'Mud Fish'],
    datasets: [
      {
        label: 'Count',
        data: [234, 1500, 300, 400], // Example values, replace with actual data
        backgroundColor: ['#33C1FF', '#FF5733'],
        borderColor: ['#33C1FF', '#FF5733'],
        borderWidth: 1
      }
    ]
  };
  
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
          text: 'Products'
        },
        stacked: true,
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        },
        stacked: true,
      }
    }
  };

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
      <ul className="side-menu">
  <li>
    <Link to="/seller_dashboard" className="active">
      <i className='bx bxs-dashboard icon'></i> Dashboard
    </Link>
  </li>
  <li>
    <Link to="/manage_product">
      <i className='bx bxs-box icon'></i> Manage Products
    </Link>
  </li>
  <li>
    <Link to="/manage_category">
      <i className='bx bxs-category icon'></i> Manage Category
    </Link>
  </li>
  <li>
    <Link to="/manage_order">
      <i className='bx bxs-cart icon'></i> Manage Orders
    </Link>
  </li>
</ul>

      </section>

      <section id="content">
        <nav>
        <i
            className='bx bx-menu toggle-sidebar'
            onClick={() => setSidebarHidden(prev => !prev)}
          ></i>
          <span className="divider"></span>
          <div className="profile" style={{marginLeft: '94%', position: 'absolute'}}>
            <img 
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
              alt="Profile"
              onClick={() => setProfileDropdownVisible(prev => !prev)}
            />
            <ul className={`profile-link ${profileDropdownVisible ? 'show' : ''}`}>
            <li>
  <Link to="/seller_profile">
    <i className='bx bxs-user-circle icon'></i> Profile
  </Link>
</li>
              <li><a href="#"><i className='bx bxs-log-out-circle'></i> Logout</a></li>
            </ul>
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
							<h2>1500</h2>
							<p>No of Products</p>
						</div>
						<i className='bx bx-store-alt icon'></i>
					</div>
				</div>
				<div className="card">
					<div className="head">
						<div>
							<h2>234</h2>
							<p>No of Orders</p>
						</div>
						<i className='bx bx-shopping-bag icon down'></i>
					</div>
				</div>
				<div className="card">
					<div className="head">
						<div>
							<h2>465</h2>
							<p>No of Categories</p>
						</div>
						<i className='bx bx-category icon'></i>
					</div>
				</div>
				<div className="card">
					<div className="head">
						<div>
							<h2>$235,000</h2>
							<p>Revenue Sales</p>
						</div>
						<i className='bx bxs-bank icon'></i>
					</div>
				</div>
			</div>

          <div className="data">
  <div className="content-data">
    <div className="chart">
      <Line data={chartData} options={chartOptions} />
    </div>
    <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>Revenue Sales Per Month</h3>
  </div>
  <div className="content-data">
    <div className="chart">
      <Bar data={chartComparison} options={chartComparisonOptions} />
    </div>
    <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>Highest Products Sales Per Month</h3>
  </div>
</div>

        </main>
      </section>
    </div>
  );
}

export default Dashboard;
