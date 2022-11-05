import React from "react";
import {useParams, useNavigate} from "react-router-dom";
import _ from "lodash";
import Modal from 'react-modal';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './Team.css';

import Table from '../Table/Table.js';
import Task from '../Task/Task.js';

import OcurrenceType from '../Enums/OccurrenceType.js';

import { config } from "../../config/Constants.js";
const URL = config.url.API_URL;

async function getTeamData(teamId) {
  return fetch(URL + '/api/teams/getTeam?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function getDataOfDevsNotOnTeam(teamId) {
  return fetch(URL + '/api/users/getDevelopersNotOnTeam?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function addDevToTeam(devId, teamId) {
  return fetch(URL + '/api/teams/addDevToTeam?devId='+ devId +'&teamId=' + teamId, {
    method: "PUT",
  })
  .catch(err => {
    console.error(err);
  });
}

async function removeDevFromTeam(devId, teamId) {
  return fetch(URL + '/api/teams/removeDevFromTeam?devId='+ devId +'&teamId=' + teamId, {
    method: "PUT",
  })
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

async function createTask(newTask, teamId) {
  return fetch(URL + '/api/tasks/createNewTask?teamId=' + teamId, {
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

async function getTasks(teamId) {
  return fetch(URL + '/api/tasks/getOnGoingTask?teamId=' + teamId)
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function markTaskAsFinished(taskId) {
  return fetch(URL + '/api/tasks/markAsFinished?taskId=' + taskId, {
    method: "PUT"
  })
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

async function createNewOccurrence(newOccurrence) {
  newOccurrence.occurrenceType = parseInt(newOccurrence.occurrenceType, 10)
  return fetch(URL + '/api/occurrences/createOccurrence', {
    method: "POST",
    body: JSON.stringify(newOccurrence),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
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

  const newOccurrenceModel = {
    description: "",
    occurrenceType: OcurrenceType.Bug,
    teamId: id,
    developerId: props.userId
  }

  const [teamData, setTeamData] = React.useState({});
  const [devsNotOnTeam, setDevsNotOnTeam] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [occurrenceModalOpen, setOccurrenceModalOpen] = React.useState(false);
  const [newTaskData, setNewTaskData] = React.useState(newTaskModel)
  const [newOccurrenceData, setNewOccurrenceData] = React.useState(newOccurrenceModel);
  const [tasksData, setTasksData] = React.useState({});

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
    getTasks(id)
    .then(data => setTasksData(data))
    .catch(err => {
      console.log("Erro ao carregar tarefas do time");
    })
  },[id])

  const updateTasks = () => {
    getTasks(id)
    .then(data => setTasksData(data))
    .catch(err => {
      console.log("Erro ao carregar tarefas do time");
    })
  }

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
 
  function markAsFinished (taskId) {
    markTaskAsFinished(taskId)
    .then(updateTasks)
    .catch(err => {
      console.log("Erro ao finalizar tarefa");
    })
  }


  const onGoingTasks= _.filter(tasksData, (task) => {
    return task.startedOn != null && task.finishedOn == null;
  })

  const pendingTasks= _.filter(tasksData, (task) => {
    return task.startedOn == null && task.finishedOn == null;
  })

  const finishedTasks= _.filter(tasksData, (task) => {
    return task.startedOn != null && task.finishedOn != null;
  })

  const onGoingTasksCards = _.map(onGoingTasks, (task) => {
    return (
      <Task taskData={task} handleFinish={markAsFinished} isManager={props.isManager} key={task.id}/>
    )
  })

  const pedingTasksCards = _.map(pendingTasks, (task) => {
    return (
      <Task taskData={task} handleFinish={markAsFinished} isManager={props.isManager} key={task.id}/>
    )
  })

  const finishedTasksCards = _.map(finishedTasks, (task) => {
    return (
      <Task taskData={task} handleFinish={markAsFinished} isManager={props.isManager} key={task.id}/>
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

  //occurrence modal functions
  function openOccurrenceModal() {
    setOccurrenceModalOpen(true);
  }

  function closeOccurrenceModal() {
    setOccurrenceModalOpen(false);
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

  const handleNewOccurrenceForm = (event) => {
    const {name, value} = event.target;
    setNewOccurrenceData(prevNewOccurrenceData => {
      return {
        ...prevNewOccurrenceData,
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

  const submitOccurrenceForm = async event => {
    event.preventDefault();
    await createNewOccurrence(newOccurrenceData)
      .then(closeOccurrenceModal())
      //.then(setNewOccurrenceData(newOccurrenceModel))
      .catch(err => {
        console.log("Erro ao criar ocorrência");
      })
  }

  return (
    <div className="team">
      <h1> {teamData.project} / {teamData.teamName}</h1>
      {props.isManager() && <div>
        <div className="dev-tables">
          <h3>Membros do time</h3>
          {devs.length >= 1 && <Table columns={columns} data={devs} />}
        </div>
        <button className="btn-primary" onClick={openModal}>Adicionar ao time</button>  
      </div>}
      <br />
      <div className="tasks">
        <h2>Tarefas</h2>
        <Tabs>
          <TabList>
            <Tab>Pendentes</Tab>
            <Tab>Em andamento</Tab>
            <Tab>Concluídas</Tab>
          </TabList>

          <TabPanel>
            <div className="tasks-section">
              {pedingTasksCards}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="tasks-section">
              {onGoingTasksCards} 
            </div>
          </TabPanel>
          <TabPanel>
            <div className="tasks-section">
              {finishedTasksCards}    
            </div>      
          </TabPanel>
        </Tabs>
        
        {props.isManager() && <button className="btn-primary" onClick={openTaskModal}>Criar Tarefa</button>}
      </div>
      <br />
      {props.isManager() && <button className="btn-danger" onClick={removeTeam}>Excluir Time</button>}
      {!props.isManager() && <button className="btn-primary" onClick={openOccurrenceModal}>Ocorrência</button>}
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
      <Modal
        isOpen={occurrenceModalOpen}
        onRequestClose={closeOccurrenceModal}
        contentLabel="Example Modal"
        className="modal task-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeOccurrenceModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Nova ocorrência</h3>
        <form onSubmit={submitOccurrenceForm}>
          <label>Descreva a ocorrência</label>
          <textarea 
            type="text"
            name="description"
            value={newOccurrenceData.description}
            onChange={handleNewOccurrenceForm}
            required
          />
          <label>Categoria</label>
          <select
            name="occurrenceType"
            value={newOccurrenceData.occurrenceType}
            onChange={handleNewOccurrenceForm}
            required
          >
            <option value={OcurrenceType.Bug}>Bug</option>
            <option value={OcurrenceType.GameDesignProblem}>Problema em Game Design</option>
            <option value={OcurrenceType.DocumentationIssue}>Problema na Documentação</option>
            <option value={OcurrenceType.PrototypeInconsistency}>Problema com os Protótipos</option>
            <option value={OcurrenceType.TechProblem}>Problema Técnico</option>
            <option value={OcurrenceType.Testing}>Testes Ineficazes</option>
            <option value={OcurrenceType.DevToolsProblem}>Problema com as Ferramentas de Desenvolvimento</option>
            <option value={OcurrenceType.MissCommunication}>Problema de Comunicação</option>
            <option value={OcurrenceType.CrunchTime}>Crunch (Trabalho Excessivo)</option>
            <option value={OcurrenceType.TeamConflict}>Conflitos na Equipe</option>
            <option value={OcurrenceType.RemovedFeature}>Remoção de Funcionalidade</option>
            <option value={OcurrenceType.UnexpectedFeature}>Nova Funcionalidade de Fora do Planejamento</option>
            <option value={OcurrenceType.LowBudget}>Problema Financeiro</option>
            <option value={OcurrenceType.MissPlaning}>Problema no Planejamento e Gestão do Projeto</option>
            <option value={OcurrenceType.SecurityProblem}>Problema de Segurança</option>
            <option value={OcurrenceType.PoorBuiltScope}>Problema com o Escopo do Projeto</option>
            <option value={OcurrenceType.MarketingIssue}>Problema com o Marketing</option>
            <option value={OcurrenceType.MonetizationProblem}>Problema no Planejamento de Monetização</option>
          </select>
          <button className="btn-primary">Criar</button>
        </form>
      </Modal>
    </div>
  )
}

export default Team;