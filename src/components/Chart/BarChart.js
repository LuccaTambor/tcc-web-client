import React from "react";
import {ChartJs as Chart} from 'chart.js/auto'
import { Bar  } from 'react-chartjs-2';

import "./BarChart.css";

function BarChart(props) {
  const labels = props.myLabels;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Ocorrências no mês",
        backgroundColor: "rgba(150, 116, 201, 0.7)",
        borderColor: "rgb(255, 99, 132)",
        data: props.myData,
      },
    ],
  };
  return (
    <div className="my-chart">
      <Bar data={data}/>
    </div>
  );

}

export default BarChart;