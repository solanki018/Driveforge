'use client';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function AnalyticsPanel({
  uploadHistory,
}: {
  uploadHistory: Record<string, number>;
}) {
  const dates = Object.keys(uploadHistory).sort();
  const values = dates.map((date) => uploadHistory[date]);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Uploads per Day',
        data: values,
        fill: false,
        borderColor: '#60A5FA',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Upload History', color: '#ffffff' },
    },
    scales: {
      x: { ticks: { color: '#ffffff' } },
      y: { ticks: { color: '#ffffff' } },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <Line data={data} options={options} />
    </div>
  );
}
