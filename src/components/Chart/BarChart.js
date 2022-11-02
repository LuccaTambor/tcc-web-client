import React from "react";
import { Bar } from 'react-chartjs-2';

import "./BarChart.css";

function BarChart(props) {
  const labels = props.myLabels;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Ocorrências no dia",
        backgroundColor: "rgb(150, 116, 201)",
        borderColor: "rgb(255, 99, 132)",
        data: props.myData,
      },
    ],
  };
  return (
    <div className="my-chart">
      <Bar data={data} />
    </div>
  );

}

export default BarChart;