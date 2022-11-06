import React from "react";
import {Chart as ChartJS} from 'chart.js/auto'
import { Pie } from 'react-chartjs-2';

import "./BarChart.css";

function PieChart(props) {

  const data = {
    labels: props.myLabels,
    datasets: [
      {
        label: '# of Votes',
        data: props.myData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(43, 95, 5, 0.2)',
          'rgba(109, 217, 184, 0.2)',
          'rgba(14, 181, 216, 0.2)',
          'rgba(157, 36, 157, 0.2)',
          'rgba(241, 35, 31, 0.2)',
          'rgba(203, 136, 34, 0.2)',
          'rgba(208, 10, 201, 0.2)',
          'rgba(101, 40, 34, 0.2)',
          'rgba(30, 209, 144, 0.2)',
          'rgba(40, 73, 92, 0.2)',
          'rgba(76, 158, 105, 0.2)',
          'rgba(229, 152, 67, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(43, 95, 5, 1)',
          'rgba(109, 217, 184, 1)',
          'rgba(14, 181, 216, 1)',
          'rgba(157, 36, 157, 1)',
          'rgba(241, 35, 31, 1)',
          'rgba(203, 136, 34, 1)',
          'rgba(208, 10, 201, 1)',
          'rgba(101, 40, 34, 1)',
          'rgba(30, 209, 144, 1)',
          'rgba(40, 73, 92, 1)',
          'rgba(76, 158, 105, 1)',
          'rgba(229, 152, 67, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return(
    <div className="my-pie-chart">
       <Pie data={data} />
    </div>
  )
}

export default PieChart;