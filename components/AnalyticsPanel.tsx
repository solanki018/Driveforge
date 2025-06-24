import { Line } from 'react-chartjs-2';
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
        borderColor: '#3B82F6',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Upload History' },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <Line data={data} options={options} />
    </div>
  );
}
