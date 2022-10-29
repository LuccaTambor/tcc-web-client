import React from "react";
import {useParams} from "react-router-dom";
import _ from "lodash";

import './Team.css';

async function getData(teamId) {
  return fetch('/api/teams/getTeam?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

function Team(props) {
  const {id} = useParams();
  const [teamData, setTeamData] = React.useState({});

  React.useEffect(() => {
    getData(id)
    .then(data => setTeamData(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  },[id])


  const devs = _.map(teamData.developers, (dev,i) => {
    return (
      <p key={i}>{dev.name}</p>
    )
  });

  return (
    <div className="team">
      <h1>{teamData.project} / {teamData.teamName}</h1>
      {devs}
    </div>
    
  )
}

export default Team;