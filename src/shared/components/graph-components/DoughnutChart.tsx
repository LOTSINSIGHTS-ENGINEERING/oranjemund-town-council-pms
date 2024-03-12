interface IProps {
  title: string;
  ylabel: string;
  labels: string[];
  data: number[];
}
const DoughnutChart = (props: IProps) => {
  const { title, ylabel, labels, data } = props;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
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
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="graph-comp doughnut uk-card-small uk-card-default uk-card-body uk-card-hover">
      <h3 className="title">{title}</h3>
      <div className="wrapper">
        {/* <Doughnut data={dataFormat} options={options} /> */}
      </div>
    </div>
  );
};

export default DoughnutChart;
