import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import _ from "lodash";
import Modal from 'react-modal';

import './Team.css';

import Table from '../Table/Table.js';

async function getTeamData(teamId) {
  return fetch('/api/teams/getTeam?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function getDataOfDevsNotOnTeam(teamId) {
  return fetch('/api/users/getDevelopersNotOnTeam?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function addDevToTeam(devId, teamId) {
  return fetch('/api/teams/addDevToTeam?devId='+ devId +'&teamId=' + teamId, {
    method: "PUT",
  })
  .catch(err => {
    console.error(err);
  });
}

async function removeDevFromTeam(devId, teamId) {
  return fetch('/api/teams/removeDevFromTeam?devId='+ devId +'&teamId=' + teamId, {
    method: "PUT",
  })
  .catch(err => {
    console.error(err);
  });
}

async function deleteTeam (teamId) {
  return fetch('/api/teams/deleteTeam?teamId=' + teamId, {
    method: "DELETE",
  })
  .catch(err => {
    console.error(err);
  });
}

Modal.setAppElement('#root');

function Team(props) {
  const navigate = useNavigate();
  const {id} = useParams();
  const [teamData, setTeamData] = React.useState({});
  const [devsNotOnTeam, setDevsNotOnTeam] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    getTeamData(id)
    .then(data => setTeamData(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  },[id])

  React.useEffect(() => {
    getDataOfDevsNotOnTeam(id)
    .then(data => setDevsNotOnTeam(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  },[id])

  const devs = _.map(teamData.developers, (dev,i) => {
    return {
      id: dev.id,
      name: dev.name,
      document: dev.document,
      function: dev.function,
    }
  });

  const devsNotOnTeamData = _.map(devsNotOnTeam, (dev) => {
    return {
      id: dev.id,
      name: dev.name,
      function: dev.function,
    }
  })

  const updateTeam = async () => {
    await getTeamData(id)
    .then(data => setTeamData(data))
    .catch(err => {
      console.log("Erro ao carregar dados dos projetos.");
    })
  }

  const addToTeam = async (devId) => {
    await addDevToTeam(devId, id)
    .then(updateTeam)
    .then(closeModal())
    .catch(err => {
      console.log("Erro ao adiconar dev ao time");
    })
  }

  const removeFromTeam = async (devId) => {
    await removeDevFromTeam(devId, id)
    .then(updateTeam)
    .then(closeModal())
    .catch(err => {
      console.log("Erro ao remover dev ao time");
    })
  }


  const removeTeam = async () => {
    await deleteTeam(id)
    .then(navigate(-1))
    .catch(err => {
      console.log("Erro ao deletar time");
    })
  }

  const columns = [
    {
      Header: 'Nome',
      accessor: 'name'
    },
    {
      Header: 'Cargo',
      accessor: 'function',
    },
    {
      Header: 'Documento',
      accessor: 'document',
    },
    {
      Header: "Ação",
      Cell: row => (
        <button className="delete-btn" onClick={e => removeFromTeam(row.row.original.id)} title="Remover do time"> 
          <i className="fas fa-times"></i>
        </button>
      )
    }
  ];

  //modal functions
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const AddDevColumns =
  [
    {
      Header: 'Nome',
      accessor: 'name'
    },
    {
      Header: 'Cargo',
      accessor: 'function',
    },
    {
      Header: "Ação",
      Cell: row => (
        <button className="add-btn" onClick={e => addToTeam(row.row.original.id)} title="Adicionar ao time"> 
          <i className="fas fa-plus"></i>
        </button>
      )
    }
  ];
  return (
    <div className="team">
      <h1> {teamData.project} / {teamData.teamName}</h1>
      <div className="dev-tables">
        <h3>Membros do time</h3>
        {devs.length >= 1 && <Table columns={columns} data={devs} />}
      </div>
      <button className="btn-primary" onClick={openModal}>Adicionar ao time</button>
      <br />
      <button className="btn-danger" onClick={removeTeam}>Excluir Time</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal team-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Adicionar desenvolvedor ao time</h3>
        <div className="dev-tables">
          <Table columns={AddDevColumns} data={devsNotOnTeamData} />
        </div>
      </Modal>
    </div>
  )
}

export default Team;