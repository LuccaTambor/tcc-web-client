import React from "react";
import {useParams} from "react-router-dom";
import Moment from 'react-moment';

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

  return (
    <div className="project-details">
      <h1 className="project-title">{projectData.description}</h1>
      <small className="start-date">Data de início: <Moment format="DD/MM/YYYY">{projectData.startedOn}</Moment></small>
    </div>
  )
}
export default ProjectDetails;