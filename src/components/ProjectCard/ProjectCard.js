import React from "react";
import Moment from 'react-moment';
import moment from 'moment';
import {Link} from "react-router-dom";

import './ProjectCard.css';

function ProjectCard(props) {
  const projectDetailsUrl = "/detalhes-projeto/" + props.projectData.id;

  const status = (date, startDate) => {
    let expectedDate = moment(date);
    let start = moment(startDate)
    let today = moment();

    if(start > today)
    return (<span>Não Iniciado</span>);
    if(expectedDate > today)
      return (<span>Em andamento</span>);
    if(expectedDate < today)
      return (<span>Atrasado</span>);
  }

  return (
    <Link to={projectDetailsUrl} className="project-card">
      <div className="project-card-preview">
        <h6>Projeto</h6>
        <h2>{props.projectData.description}</h2>
      </div>
      <div className="project-card-info">
        <div className="dates">
          <h6>Iniciado em: <Moment format="DD/MM/YYYY">{props.projectData.startedOn}</Moment></h6>
          <h3>Prazo final: <Moment format="DD/MM/YYYY">{props.projectData.expectedFinishDate}</Moment></h3>
        </div>
        <div className="main-info">
          <h3>Times: {props.projectData.teams.length}</h3>
          <h3>Status: {status(props.projectData.expectedFinishDate, props.projectData.startedOn)}</h3>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard;