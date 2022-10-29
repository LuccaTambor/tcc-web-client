import React from "react";
import _ from "lodash";

import './Projects.css'

//components
import ProjectCard from '../ProjectCard/ProjectCard.js';

async function getData(userId) {
  return fetch('/api/projects/GetManagerProjects?id=' + userId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

function Projects(props) {
  const [projectsData, setProjectsData] = React.useState({})
  const userId = props.userData?.id;

  React.useEffect(() => {
    getData(userId)
    .then(data => setProjectsData(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  },[userId])

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
        {props.isManager() &&
          projectsDescriptions
        }
      </div>  
    </div>
  )
}

export default Projects