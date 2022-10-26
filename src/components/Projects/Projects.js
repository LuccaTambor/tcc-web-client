import React from "react";
import _ from "lodash";

import './Projects.css'

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
        <h1 key={i}>{proj.description}</h1>
    );
  });
  
  return(
    <div className="projects">
      <h2 className="page-title">Projetos</h2>
      {props.isManager() &&
        <h2>Vc é um gerente </h2>
        && projectsDescriptions
      }
      
    </div>
  )
}

export default Projects