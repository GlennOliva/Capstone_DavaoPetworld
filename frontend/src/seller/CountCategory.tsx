import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface CategoryProps {
    startDate: Date | null;
    endDate: Date | null;
}

const CountCategory: React.FC<CategoryProps> = ({ startDate, endDate }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

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
        const fetchCategoryData = async () => {
          try {
            const params: { [key: string]: string | undefined } = {};
      
            // Add startDate and endDate only if they are not null
            if (startDate) {
              params.startDate = startDate.toISOString().split('T')[0]; // format as 'YYYY-MM-DD'
            }
            if (endDate) {
              params.endDate = endDate.toISOString().split('T')[0]; // format as 'YYYY-MM-DD'
            }
      
            // Send request with optional query parameters
            const response = await axios.get(`${apiUrl}no_products`, { params });
      
            const labels = response.data.map((item: { category_name: string }) => item.category_name);  // Extract category names
            const data = response.data.map((item: { count: number }) => item.count);  // Extract counts
      
            // Generate random colors for each category dynamically
            const backgroundColor = labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
            const borderColor = backgroundColor;
      
            setCategoryData({
              labels,
              datasets: [{
                label: 'Count',
                data,
                backgroundColor,
                borderColor,
                borderWidth: 1
              }]
            });
          } catch (error) {
            console.error('There was an error fetching the category data:', error);
          }
        };
      
        fetchCategoryData();
      }, [startDate, endDate]);  // Re-fetch data when startDate or endDate changes
      

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

    return (
        <div className="content-data">
            <div className="chart">
                <Bar data={categoryData} options={chartComparisonOptionsCategories} />
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '3%' }}>Comparison of Product Categories</h3>
        </div>
    );
};

export default CountCategory;
