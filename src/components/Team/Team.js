import React from "react";
import {useParams} from "react-router-dom";
import _ from "lodash";
import Modal from 'react-modal';

import './Team.css';

import Table from '../Table/Table.js';

async function getDataOfDevs(teamId) {
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

async function addDevToTeam(teamId, devId) {
  return fetch('/api/teams/addDevToTeam?devId='+ devId +'&teamId=' + teamId, {
    method: "PUT",
  })
  .catch(err => {
    console.error(err);
  });
}

Modal.setAppElement('#root');

function Team(props) {
  const {id} = useParams();
  const [teamData, setTeamData] = React.useState({});
  const [devsNotOnTeam, setDevsNotOnTeam] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    getDataOfDevs(id)
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

  const removeFromTeam = (name) => {
    console.log(name);
  }

  const addToTeam = async (devId) => {
    await addDevToTeam(devId, id)
    .then(closeModal())
    .catch(err => {
      console.log("Erro ao criar novo time");
    })
  }

  const columns = React.useMemo(
    () => [
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
          <button className="delete-btn" onClick={e => removeFromTeam(row.row.original)} title="Remover do time"> 
            <i className="fas fa-times"></i>
          </button>
        )
      }
    ],
    []
  );

  //modal functions
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const AddDevColumns = React.useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div className="team">
      <h1> {teamData.project} / {teamData.teamName}</h1>
      <div className="dev-tables">
        <h3>Membros do time</h3>
        {devs.length >= 1 && <Table columns={columns} data={devs} />}
      </div>
      <button className="btn-primary" onClick={openModal}>Adicionar ao time</button>
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
          {devs.length >= 1 && <Table columns={AddDevColumns} data={devsNotOnTeamData} />}
        </div>
      </Modal>
    </div>
  )
}

export default Team;