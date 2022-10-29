import React from "react";
import Moment from 'react-moment';

import './ProjectCard.css';

function ProjectCard(props) {
  return (
    <div className="project-card">
      <div className="project-card-preview">
        <h6>Projeto</h6>
        <h2>{props.projectData.description}</h2>
      </div>
      <div class="project-card-info">
        <h6>Prazo final: <Moment format="DD/MM/YYYY">{props.projectData.expectedFinishDate}</Moment></h6>
        <h2>Alguma informação aqui</h2>
        <button class="btn">Detalhes</button>
      </div>
    </div>
  )
}

export default ProjectCard;