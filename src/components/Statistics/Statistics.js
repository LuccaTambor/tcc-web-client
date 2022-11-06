import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Moment from 'react-moment';
import _ from "lodash";
import Modal from 'react-modal';

import "./Statistics.css";

import BarChart from "../Chart/BarChart.js";
import PieChart from "../Chart/PieChart";
import Table from "../Table/Table.js";

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
  const [occurrenceDetaisOpen, setOccurrenceDetailsOpen] =  React.useState(false);
  const [occurreceDetaisText, setOccurreceDetaisText] = React.useState("");

  React.useEffect(() => {
    getData(props.managerId)
      .then(data => setProjectsStats(data))
      .catch(err => {
        console.log("Erro ao carregar suas estatísticas.");
      })
  },[props])


  //modal functions
  function openOccurrenceDeatilsModal(detailsText) {
    setOccurreceDetaisText(detailsText);
    setOccurrenceDetailsOpen(true);
  }

  function closeOccurrenceDeatilsModal() {
    setOccurrenceDetailsOpen(false);
    setOccurreceDetaisText("");
  }

  const projectTagNames = _.map(projectsStats, projStats => {
    return (
      <Tab key={projStats.id}><b>{projStats.projectName}</b></Tab>
    )
  })

  const projectPanelContents = _.map(projectsStats, projStats => {
    const test = _.groupBy(projStats.occurrences, (ocor) => {
      return ocor.dateMonth
    });
  
    const monthLabels = (Object.keys(test));
    const monthsOcurrencesData = _.map(test, month => {
      return month.length;
    })

    const groupedByType = _.groupBy(projStats.occurrences, (ocor) => {
      return ocor.occurrenceTypeString
    })

    const typeLabels = (Object.keys(groupedByType));
    const typesData = _.map(groupedByType, type => {
      return type.length;
    })

    const groupedByTeam = _.groupBy(projStats.occurrences, (ocor) => {
      return ocor.team
    })
    const teamsLabels = (Object.keys(groupedByTeam));

    const teamsTags = _.map(teamsLabels, (team, i) => {
      return (
        <Tab key={i}><b>{team}</b></Tab>
      )
    })

    const teamPanels = _.map(groupedByTeam, teamOccurrences => {
      

      const occurrenceColumns =
      [
        {
          Header: 'Data',
          accessor: 'date'
        },
        {
          Header: 'Categoria',
          accessor: 'occurrenceTypeString',
        },
        {
          Header: "Relator",
          accessor: "developerCreator"
        }, 
        {
          Header: "Detalhes",
          Cell: row => (
            <button className="desc-btn" title="Detalhes da ocorrência" onClick={e => openOccurrenceDeatilsModal(row.row.original.description)}> 
              <i className="fas fa-list"></i>
            </button>
          )
        }
      ];

      return (
        <TabPanel>
          <p>O time tem <span className="danger-text">{teamOccurrences.length} ocorrências</span></p>
          {teamOccurrences.length > 0 && <Table columns={occurrenceColumns} data={teamOccurrences} />}
        </TabPanel>
      )
    })


    return (
      <TabPanel key={projStats.id}>
        <h3>Entrega esperada:<Moment format="DD/MM/YYYY">{projStats.expectedDate}</Moment></h3>
        <div className="charts-section">
          <div className="chart-row">
            <div className="">
              <h2>Ocorrências nos últimos meses</h2>
              <BarChart myLabels={monthLabels} myData={monthsOcurrencesData}/>
            </div>
            <div className="">
              <h2>Tipos de Ocorrências</h2>
              <PieChart myLabels={typeLabels} myData={typesData}/>
            </div>  
          </div> 
          <div className="chart-teams">
            <div className="">
              <h2>Ocorrências por time</h2>
              <Tabs>
                <TabList>
                  {teamsTags}
                </TabList>

                {teamPanels}
              </Tabs>
            </div>
          </div>     
        </div>       
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
      <Modal
        isOpen={occurrenceDetaisOpen}
        onRequestClose={closeOccurrenceDeatilsModal}
        contentLabel="Example Modal"
        className="modal occurrence-details-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeOccurrenceDeatilsModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Detalhes da ocorrência</h3>
        <textarea 
          type="text"
          readOnly
          value={occurreceDetaisText}
        />
      </Modal>
    </div>
  )
}

export default Statistics;