import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

const PaymentMethodChart: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  const [paymentData, setPaymentData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [
      {
        label: 'Total Sales',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const sellerId = localStorage.getItem('seller_id');  // Replace with actual sellerId, possibly from context or props

    axios.get(`${apiUrl}api/payment-method-stats`, {
        params: { seller_id: sellerId }
    })
    .then((response) => {
        const { data } = response.data;

        const labels = data.map((item: { payment_method: string }) => item.payment_method);
        const salesData = data.map((item: { total_sales: number }) => item.total_sales);

        const backgroundColor = labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
        const borderColor = backgroundColor;

        setPaymentData({
            labels,
            datasets: [
                {
                    label: 'Total Sales',
                    data: salesData,
                    backgroundColor,
                    borderColor,
                    borderWidth: 1,
                },
            ],
        });
    })
    .catch((error) => {
        console.error('Error fetching payment method stats:', error);
    });
}, []);



  const chartPreferredPaymentMethods: ChartOptions<'bar'> = {
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
      x: {
        title: {
          display: true,
          text: 'Payment Methods',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Sales',
        },
      },
    },
  };

  return (
    <div className="content-data">
      <div className="chart">
        <Bar data={paymentData} options={chartPreferredPaymentMethods} />
      </div>
      <h3 style={{ textAlign: 'center', fontSize: '16px', paddingTop: '1%' }}>
        Preferred Payment Methods
      </h3>
    </div>
  );
};

export default PaymentMethodChart;
