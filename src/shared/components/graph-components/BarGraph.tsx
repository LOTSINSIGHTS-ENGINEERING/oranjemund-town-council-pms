import { Bar } from "react-chartjs-2";
// Chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  title: string;
  ylabel: string;
  labels: string[];
  data: number[];
  type?: "vertical" | "horizontal";
  scales?: any;
  min?: number;
  max?: number;
}
const BarGraph = (props: IProps) => {
  const {
    title,
    ylabel,
    labels,
    data,
    type = "vertical",
    scales,
    min = 1,
    max = 5,
  } = props;

  const options = {
    indexAxis: type === "horizontal" ? ("y" as const) : ("x" as const),
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: title,
      },
    },
    scales: scales
      ? scales
      : {
        y: {
          min: min,
          max: max,
        },
      },
  };

  const dataFormat = {
    labels,
    datasets: [
      {
        label: ylabel,
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="graph-comp">
      <h3 className="title">{title}</h3>

      <div className="wrapper">
        <Bar data={dataFormat} options={options} />
      </div>
    </div>
  );
};

export default BarGraph;
