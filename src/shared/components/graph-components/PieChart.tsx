import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface IProps {
  title: string;
  ylabel: string;
  labels: string[];
  data: number[];
}
const PieChart = (props: IProps) => {
  const { title, ylabel, labels, data } = props;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right" as "right",
      },
    },
    hoverOffset: 4,
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
    <div className="pie-chart">
      <h3 className="title kit-title">{title}</h3>
      <div className="wrapper">
        <Pie data={dataFormat} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
