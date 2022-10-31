import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import _ from "lodash";
import Modal from 'react-modal';
import moment from 'moment';

import './Team.css';

import Table from '../Table/Table.js';
import Task from '../Task/Task.js';

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

async function createTask(newTask, teamId) {
  return fetch('/api/tasks/createNewTask?teamId=' + teamId, {
    method: "POST",
    body: JSON.stringify(newTask),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .catch(err => {
    console.error(err);
  });
}

async function getOnGoingTasks(teamId) {
  return fetch('/api/tasks/getOnGoingTask?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function markTaskAsFinished(taskId) {
  return fetch('/api/tasks/markAsFinished?taskId=' + taskId, {
    method: "PUT"
  })
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

Modal.setAppElement('#root');

function Team(props) {
  const navigate = useNavigate();
  const {id} = useParams();
  const newTaskModel = {
    code: 0,
    title: "",
    description: "",
    expectedDate: moment().toDate()
  };

  const [teamData, setTeamData] = React.useState({});
  const [devsNotOnTeam, setDevsNotOnTeam] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [newTaskData, setNewTaskData] = React.useState(newTaskModel)
  const [onGoingTasks, setOnGoingTasks] = React.useState({});

  React.useEffect(() => {
    getTeamData(id)
    .then(data => setTeamData(data))
    .catch(err => {
      console.log("Erro ao carregar dados do time.");
    })
  },[id])

  React.useEffect(() => {
    getDataOfDevsNotOnTeam(id)
    .then(data => setDevsNotOnTeam(data))
    .catch(err => {
      console.log("Erro ao carregar membros do time");
    })
  },[id])

  React.useEffect(() => {
    getOnGoingTasks(id)
    .then(data => setOnGoingTasks(data))
    .catch(err => {
      console.log("Erro ao carregar tarefas do time");
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
 
  function markAsFinished (id) {
    // await markTaskAsFinished(id)
    // .catch(err => {
    //   console.log("Erro ao finalizar tarefa");
    // })
    console.log(id);
  }

  const tasks = _.map(onGoingTasks, (task) => {
    return (
      <Task taskData={task} finish={markAsFinished}/>
    )
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

  //task modal functions
  function openTaskModal() {
    setTaskModalOpen(true);
  }

  function closeTaskModal() {
    setTaskModalOpen(false);
  }

  const handleNewTaskForm = (event) => {
    const {name, value} = event.target;
    setNewTaskData(prevNewTaskData => {
      return {
        ...prevNewTaskData,
        [name]: value
      }
    })
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

  const submitTaskForm = async event => {
    event.preventDefault();
    await createTask(newTaskData, id)
      .then(closeTaskModal())
      .then(setNewTaskData(newTaskModel))
      .catch(err => {
        console.log("Erro ao criar tarefa");
      })
  }



  return (
    <div className="team">
      <h1> {teamData.project} / {teamData.teamName}</h1>
      <div className="dev-tables">
        <h3>Membros do time</h3>
        {devs.length >= 1 && <Table columns={columns} data={devs} />}
      </div>
      <button className="btn-primary" onClick={openModal}>Adicionar ao time</button>
      <br />
      <div className="tasks">
        <h3>Tarefas em andamento:</h3>
        <div className="tasks-section">
          {tasks}
        </div>
        <button className="btn-primary" onClick={openTaskModal}>Criar Tarefa</button>
      </div>
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
      <Modal
        isOpen={taskModalOpen}
        onRequestClose={closeTaskModal}
        contentLabel="Example Modal"
        className="modal task-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeTaskModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Criar tarefa no time</h3>
        <form onSubmit={submitTaskForm}>
          <label>Título da Tarefa</label>
          <input 
            type="text"
            name="title"
            value={newTaskData.title}
            onChange={handleNewTaskForm}
            required
          />
          <label>Código da Tarefa</label>
          <input 
            type="number"
            name="code"
            value={newTaskData.code}
            onChange={handleNewTaskForm}
            required
            className="half"
          />
          <label>Data de conclusão esperada</label>
          <input 
            type="date"
            name="expectedDate"
            value={newTaskData.expectedDate}
            onChange={handleNewTaskForm}
            required
            className="half"
          />
          <label>Descrição</label>
          <textarea 
            type="text"
            name="description"
            value={newTaskData.description}
            onChange={handleNewTaskForm}
            required
          />
          <button className="btn-primary">Criar</button>
        </form>
      </Modal>
    </div>
  )
}

export default Team;