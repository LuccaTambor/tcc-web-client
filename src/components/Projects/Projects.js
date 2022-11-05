import React from "react";
import _ from "lodash";

import Modal from 'react-modal';
import './Projects.css'

//components
import ProjectCard from '../ProjectCard/ProjectCard.js';

import { config } from "../../config/Constants.js";
const URL = config.url.API_URL;

async function getData(userId, isManager) {
  let url = isManager ? URL + '/api/projects/GetManagerProjects?id=' : URL + '/api/projects/GetDevProjects?id='

  return fetch(url+ userId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function createProject(newProj) {
  return fetch(URL + '/api/projects/createProject' , {
    method: "POST",
    body: JSON.stringify(newProj),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .catch(err => {
    console.error(err);
  });
}

function Projects(props) {
  const userId = props.userData?.id;
  const newProjectModel = {
    description: "",
    startedOn: "",
    expectedFinishDate: "",
    managerId: userId
  };

  const [projectsData, setProjectsData] = React.useState({})
  const [projectModalOpen, setProjectModalOpen] = React.useState(false);
  const [newProjData, setNewProjData] = React.useState(newProjectModel);

  React.useEffect(() => {
    getData(userId, props.isManager())
    .then(data => setProjectsData(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  },[userId, props])

  const projects = {...projectsData};

  const projectsDescriptions = _.map(projects, (proj, i) => {
    return (
        <ProjectCard projectData={proj} key={i}/>
    );
  });

  //modal functions
  function openModal() {
    setProjectModalOpen(true);
  }

  function closeModal() {
    setProjectModalOpen(false);
  }

  const handleNewProjectForm = (event) => {
    const {name, value} = event.target;
    setNewProjData(prevProjData => {
      return {
        ...prevProjData,
        [name]: value
      }
    })
  }

  const submitProjectForm = async event => {
    event.preventDefault();
    await createProject(newProjData)
      .then(response => response.json())
      .then(data => setProjectsData(data))
      .then(setNewProjData(newProjectModel))
      .then(closeModal())
      .catch(err => {
        console.log("Erro ao criar novo projeto.");
    })
  }
  
  return(
    <div className="projects">
      <h2 className="page-title">Projetos</h2>
      <div className="project-cards">
        {projectsDescriptions}
      </div>
      {props.isManager() && <button className="btn-primary" onClick={openModal}>Criar Novo Projeto</button>}
      <Modal
        isOpen={projectModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal newproj-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Novo Projeto</h3>
        <form onSubmit={submitProjectForm}>
          <label>Nome do projeto</label>
          <input 
            type="text"
            placeholder="descrição do projeto"
            value={newProjData.description}
            name="description"
            onChange={handleNewProjectForm}
          />
          <label>Data de início</label>
          <input 
            type="date"
            value={newProjData.startedOn}
            name="startedOn"
            onChange={handleNewProjectForm}
          />
          <label>Entrega esperada em</label>
          <input 
            type="date"
            value={newProjData.expectedFinishDate}
            name="expectedFinishDate"
            onChange={handleNewProjectForm}
          />
          <button className="btn-primary">Criar</button>
        </form>
      </Modal>
    </div>
  )
}

export default Projects