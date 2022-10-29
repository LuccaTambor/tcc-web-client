import React from "react";
import {useParams, Link} from "react-router-dom";
import Moment from 'react-moment';
import _ from "lodash";

import './ProjectDetails.css';

async function getData(projId) {
  return fetch('/api/projects/getProject?id=' + projId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

function ProjectDetails(props) {
  const {id} = useParams();
  const [projectData, setProjectData] = React.useState({});

  React.useEffect(() => {
    getData(id)
    .then(data => setProjectData(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  },[id])

  const teams = _.map(projectData.teams, team => {
    const teamUrl = "/time/" + team.id;

    return (
      <Link key={team.id} to={teamUrl} className="team-link">
        <div className="team-card">
          <h2>{team.teamName}</h2>
        </div>
      </Link> 
    )
  });

  return (
    <div className="project-details">
      <h1 className="project-title">{projectData.description}</h1>
      <small className="start-date">Data de início: <Moment format="DD/MM/YYYY">{projectData.startedOn}</Moment></small>
      <h3 className="end-date">Prazo: <Moment format="DD/MM/YYYY">{projectData.expectedFinishDate}</Moment></h3>
      <div className="teams">
        <h2>Times do Projeto</h2>
        {teams} 
      </div>
    </div>
  )
}
export default ProjectDetails;