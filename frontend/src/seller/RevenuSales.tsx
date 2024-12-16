import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';

interface RevenuSalesProps {
  startDate: Date | null;
  endDate: Date | null;
}

const RevenuSales: React.FC<RevenuSalesProps> = ({ startDate, endDate }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [chartDataRevenue, setChartDataRevenue] = useState<ChartData<'line'>>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
      },
    ],
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      const sellerId = localStorage.getItem('seller_id');
      try {
        const params = new URLSearchParams();
        params.append('seller_id', sellerId || '');
        if (startDate) params.append('start_date', startDate.toISOString().split('T')[0]);
        if (endDate) params.append('end_date', endDate.toISOString().split('T')[0]);

        const response = await fetch(`${apiUrl}no_revenues?${params.toString()}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const revenueData = new Array(12).fill(0);

          data.forEach((item: { year: number; month: number; total_revenue: number }) => {
            const monthIndex = item.month - 1;
            revenueData[monthIndex] = item.total_revenue;
          });

          setChartDataRevenue({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ ...chartDataRevenue.datasets[0], data: revenueData }],
          });
        } else {
          console.error('Expected an array, but got:', data);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, [startDate, endDate]);

  const chartOptionsRevenue: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: { type: 'category', title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Cash Value' } },
    },
  };

  return <Line data={chartDataRevenue} options={chartOptionsRevenue} />;
};

export default RevenuSales;
