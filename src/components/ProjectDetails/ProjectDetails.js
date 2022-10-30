import React from "react";
import {useParams, Link} from "react-router-dom";
import Moment from 'react-moment';
import Modal from 'react-modal';
import _ from "lodash";

import './ProjectDetails.css';

async function getData(projId) {
  return fetch('/api/projects/getProject?id=' + projId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function createTeam(projectId, teamName) {
  return fetch('/api/teams/createTeam?projectId='+ projectId +'&teamName=' + teamName, {
    method: "POST",
  })
  .catch(err => {
    console.error(err);
  });
}

Modal.setAppElement('#root');

function ProjectDetails(props) {
  const {id} = useParams();
  const [projectData, setProjectData] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [newTeamForm, setNewTeamForm] = React.useState({
    teamName: ""
  });

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

  //modal functions
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleNewTeamForm = (event) => {
    const {name, value} = event.target;
    setNewTeamForm(prevLoginForm => {
      return {
        ...prevLoginForm,
        [name]: value
      }
    })
  }

  const submitTeamForm = async event => {
    event.preventDefault();
    await createTeam(projectData.id, newTeamForm.teamName)
      .then(closeModal())
      .then(setNewTeamForm({teamName:""}))
      .catch(err => {
        console.log("Erro ao criar novo time");
    })
  }
  
  return (
    <div className="project-details">
      <h1 className="project-title">{projectData.description}</h1>
      <small className="start-date">Data de início: <Moment format="DD/MM/YYYY">{projectData.startedOn}</Moment></small>
      <h3 className="end-date">Prazo: <Moment format="DD/MM/YYYY">{projectData.expectedFinishDate}</Moment></h3>
      <div className="teams">
        <h2>Times do Projeto</h2>
        <div className="list-teams">
          {teams} 
        </div>  
      </div>
      <div className="btn-primary" onClick={openModal}>Criar Time</div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal team-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Novo time do projeto {projectData.description}</h3>
        <form onSubmit={submitTeamForm}>
          <input 
            type="text"
            placeholder="nome do time"
            value={newTeamForm.teamName}
            name="teamName"
            onChange={handleNewTeamForm}
          />
          <button className="btn-primary">Criar</button>
        </form>
      </Modal>
    </div>
  )
}
export default ProjectDetails;