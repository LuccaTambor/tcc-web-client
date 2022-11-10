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
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  return (
    <div className="my-chart">
      <Bar data={data} options={options}/>
    </div>
  );

}

export default BarChart;