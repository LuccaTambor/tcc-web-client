import React from "react";
import _ from "lodash";

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

function Projects(props) {
  const [projectsData, setProjectsData] = React.useState({})
  const userId = props.userData?.id;

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
  
  return(
    <div className="projects">
      <h2 className="page-title">Projetos</h2>
      <div className="project-cards">
        {projectsDescriptions}
      </div>  
    </div>
  )
}

export default Projects