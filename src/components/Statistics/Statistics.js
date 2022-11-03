import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Moment from 'react-moment';
import moment from "moment/moment";
import _ from "lodash";

import "./Statistics.css";

import BarChart from "../Chart/BarChart.js";

import { config } from "../../config/Constants.js";
const URL = config.url.API_URL;

async function getData(managerId) {
  return fetch(URL + '/api/statistics/getStatistics?managerId=' + managerId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

function Statistics (props) {
  const [projectsStats, setProjectsStats] = React.useState({});

  React.useEffect(() => {
    getData(props.managerId)
      .then(data => setProjectsStats(data))
      .catch(err => {
        console.log("Erro ao carregar suas estatísticas.");
      })
  },[props])

  const projectTagNames = _.map(projectsStats, projStats => {
    return (
      <Tab key={projStats.id}><b>{projStats.projectName}</b></Tab>
    )
  })

  const lastThirtyDays = [...new Array(30)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format('DD/MM/YYYY'));
  const lastData = [...new Array(30)].map((i, idx) => 1);

  
  const test = _.groupBy(projectsStats[0].occurrences, (ocor) => {
    return moment(ocor.date).format('DD/MM/YYYY')
  });


  // const dataFinal = _.map(test, day => {
  //   console.log(day)
  // })

  var groups = {};


  console.log(groups);

  const projectPanelContents = _.map(projectsStats, projStats => {
    return (
      <TabPanel key={projStats.id}>
        <h3>Entrega esperada:<Moment format="DD/MM/YYYY">{projStats.expectedDate}</Moment></h3>
        <BarChart myLabels={lastThirtyDays} myData={lastData}/>
      </TabPanel>
    )
  })
  

  return (
    <div className="statistics">
      <h1>Dados e Estatísticas</h1>
      { projectTagNames && 
      <Tabs>
        <TabList>
          {projectTagNames}
        </TabList>

        {projectPanelContents}

       </Tabs>
      } 
    </div>
  )
}

export default Statistics;