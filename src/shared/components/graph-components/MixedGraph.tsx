import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export interface ILine {
  label: string;
  data: number[];
}
export interface IBar {
  label: string;
  data: number[];
}

interface IProps {
  title: string;
  labels: string[];
  line: ILine;
  bar: IBar;
  height?: number;
}
const MixedGraph = (props: IProps) => {
  const { title, labels, line, bar, height } = props;

  const options = {
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
  };

  const data = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: line.label,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        borderWidth: 2,
        fill: true,
        data: line.data,
      },
      {
        type: "bar" as const,
        label: bar.label,
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        data: bar.data,
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      className="graph-comp"
      style={{
        height: height ? height : "calc(100% - 10px)",
      }}
    >
      <h3 className="title">{title}</h3>

      <div className="wrapper">
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default MixedGraph;
