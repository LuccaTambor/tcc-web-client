import React from "react";
import {useParams, Link} from "react-router-dom";
import Moment from 'react-moment';
import Modal from 'react-modal';
import _ from "lodash";

import './ProjectDetails.css';

import { config } from "../../config/Constants.js";
const URL = config.url.API_URL;


async function getData(projId, isManager, userId) {
  let url = isManager ? URL + '/api/projects/getProject?id=' + projId : URL + '/api/projects/getProjectAsDev?id='+projId+'&devId=' + userId;

  return fetch(url)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function deleteTeam (teamId) {
  return fetch(URL + '/api/teams/deleteTeam?teamId=' + teamId, {
    method: "DELETE",
  })
  .catch(err => {
    console.error(err);
  });
}

async function createTeam(projectId, teamName) {
  return fetch(URL + '/api/teams/createTeam?projectId='+ projectId +'&teamName=' + teamName, {
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
    getData(id, props.isManager(), props.userData.id)
      .then(data => setProjectData(data))
      .catch(err => {
        console.log("Erro ao carregar dados dos projetos.");
      })
  },[id, props])

  const updateProjectData =  async () => {
    getData(id, props.isManager(), props.userData.id)
    .then(data => setProjectData(data))
    .catch(err => {
        console.log("Erro ao carregar dados dos projetos.");
    })
  }

  const removeTeam = async (teamId) => {
    await deleteTeam(teamId)
    .then(updateProjectData)
    .catch(err => {
      console.log("Erro ao deletar time");
    })
  }

  console.log(projectData)

  const teams = projectData ? _.map(projectData.teams, team => {
    const teamUrl = "/time/" + team.id;

    return (   
        <div className="team-card" key={team.id}>
          <h2>{team.teamName}</h2>
          <div className="team-info">
            <p>Membros: {team?.developers?.length}</p>
            <p>Tarefas em andamento: {team.taskNum}</p>
          </div>
          <div className="delete-section">    
            <Link to={teamUrl} className="btn-primary">Detalhes</Link> 
            {props.isManager() && <button className="btn-danger" onClick={() => {removeTeam(team.id)}}><i className="fas fa-trash"></i></button>}
          </div>
        </div>
    )
  }) : null;

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
      .then(updateProjectData)
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
        <h2>{!props.isManager() && <span>Seus</span>} Times do Projeto</h2>
        <div className="list-teams">
          {teams} 
        </div>  
      </div>
      {props.isManager() && <div className="btn-primary" onClick={openModal}>Criar Time</div>}
      <br />
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
          <button className="btn-create">Criar</button>
        </form>
      </Modal>
    </div>
  )
}
export default ProjectDetails;