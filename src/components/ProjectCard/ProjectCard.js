import React from "react";
import Moment from 'react-moment';
import moment from 'moment';
import {Link} from "react-router-dom";
import Modal from 'react-modal';

import './ProjectCard.css';

function ProjectCard(props) {
  const projectDetailsUrl = "/detalhes-projeto/" + props.projectData.id;

  const [warningModalOpen, setWarningModalOpen] =React.useState(false);

  const openWarning = () => {
    setWarningModalOpen(true);
  }

  const closeWarning = () => {
    setWarningModalOpen(false);
  }

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

  const tryToDelete = () => {
    if(props.projectData.teams.length > 0)
      openWarning();
    else
      props.toDelete(props.projectData.id);
  }

  return (
    <div className="project-card">
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
          <h3>Nº Times: {props.projectData.teams.length}</h3>
          <h3>Status: {status(props.projectData.expectedFinishDate, props.projectData.startedOn)}</h3>
          <div className="buttons-section">   
            <Link to={projectDetailsUrl} className="btn-primary">Detalhes</Link>
            {props.isManager() && <button className="btn-danger" onClick={tryToDelete}><i className="fas fa-trash"></i></button>}  
          </div>
        
        </div>
      </div>
      <Modal
        isOpen={warningModalOpen}
        onRequestClose={closeWarning}
        contentLabel="Example Modal"
        className="modal warning-modal"
        overlayClassName="overlay"
      >
        <div className="warning">
          <span className="warning-icon"><i className="fas fa-times"></i></span>
          <h3 className="warning-text">Não é possível apagar um projeto com times em atividade</h3>
          <button className="btn-danger" onClick={closeWarning}>OK</button>
        </div>
      </Modal>
    </div>
  )
}

export default ProjectCard;