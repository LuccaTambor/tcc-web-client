import React from "react";
import Moment from 'react-moment';
import {Link} from "react-router-dom";

import './ProjectCard.css';

function ProjectCard(props) {
  const projectDetailsUrl = "/detalhes-projeto/" + props.projectData.id;

  return (
    <div className="project-card">
      <div className="project-card-preview">
        <h6>Projeto</h6>
        <h2>{props.projectData.description}</h2>
      </div>
      <div className="project-card-info">
        <h6>Prazo final: <Moment format="DD/MM/YYYY">{props.projectData.expectedFinishDate}</Moment></h6>
        <h2>Alguma informação aqui</h2>
        <Link className="btn" to={projectDetailsUrl} >Detalhes</Link>
      </div>
    </div>
  )
}

export default ProjectCard;