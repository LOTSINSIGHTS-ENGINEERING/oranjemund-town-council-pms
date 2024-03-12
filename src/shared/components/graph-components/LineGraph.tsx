import { Line } from "react-chartjs-2";

// Chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  title: string;
  ylabel: string;
  labels: string[];
  data: (number | null)[];
}
const LineGraph = (props: IProps) => {
  const { title, ylabel, labels, data } = props;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 1,
        max: 5,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: title,
      },
    },
  };

  const dataFormat = {
    labels,
    datasets: [
      {
        label: ylabel,
        lineTension: 0.3,
        data: data,
        backgroundColor: "#faa05a",
        borderColor: "#faa05a",
      },
    ],
  };

  return (
    <div className="line-graph graph-component">
      <div className="wrapper">
        <Line data={dataFormat} options={options} />
      </div>
    </div>
  );
};

export default LineGraph;
