import React, { useEffect, useRef } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { observer } from "mobx-react-lite";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend
);


export const JobCartGraph = observer(() => {
const { store, api } = useAppContext();

const chartRef = useRef(null);

const high = store.jobcard.jobcard.all.map((type)=>type.asJson.urgency).filter((type)=>type === "High");
const medium = store.jobcard.jobcard.all.map((type)=>type.asJson.urgency).filter((type)=>type === "Medium");
const low = store.jobcard.jobcard.all.map((type)=>type.asJson.urgency).filter((type)=>type === "Low");


const highUrgency = high.length;
const mediumUrgency = medium.length;
const lowUrgency = low.length;

const options = {
  indexAxis: "x" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
    },
    title: {
      display: true,
      text: "Number of Job Cards Per Month",
    },
  },
};

const labels = [""];

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Job Cards",
      data: [30, 20, 34, 15, 25, 18, 40, 28, 22, 36, 45, 27],
      borderColor: "blue",
      backgroundColor: "blue",
    },
  ],
};

return (
  <div style={{width:"50%"}}><Bar options={options} data={data} 
  /></div>
)
;
});
