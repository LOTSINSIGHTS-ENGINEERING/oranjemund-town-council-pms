import React, { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useAppContext } from "../../../shared/functions/Context";

const JobCartPieChart = () => {

  const chartRef = useRef(null);
  const { api, store } = useAppContext();

  const high = store.jobcard.jobcard.all.map((type)=>type.asJson.urgency).filter((type)=>type === "High");
  const medium = store.jobcard.jobcard.all.map((type)=>type.asJson.urgency).filter((type)=>type === "Medium");
  const low = store.jobcard.jobcard.all.map((type)=>type.asJson.urgency).filter((type)=>type === "Low");


  const highUrgency = high.length;
  const mediumUrgency = medium.length;
  const lowUrgency = low.length;

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const data = {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            data: [highUrgency, mediumUrgency, lowUrgency],
            backgroundColor: ["red", "orange", "blue"],
          },
        ],
      };

      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "pie",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
            },
            title: {
              display: true,
              text: "Job Card Urgency Distribution",
            },
          },
        },
      });
    }
  }, []);

  return (
    <div style={{height:"70%"}}>
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
};

export default JobCartPieChart;
