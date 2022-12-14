import React from "react";
import {useParams} from "react-router-dom";
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
    .catch(err => {
      console.error(err);
    });
}

async function markAsStarted(taskId) {
  return fetch(URL + '/api/tasks/markAsStarted?taskId=' + taskId, {
    method: "PUT"
  })
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

async function getDevOccurrencesInTeam(teamId, devId) {
  const getUrl = '/api/occurrences/getOccurrencesDev?teamId=' + teamId +'&devId=' + devId;

  return fetch(URL + getUrl)
    .then(data => data.json())
    .catch(err => {
      console.log(err);
    })
}

Modal.setAppElement('#root');

function Team(props) {
  const {id} = useParams();
  const newTaskModel = {
    code: "",
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

  const newConfirmRemoveDevModel = {
    open: false,
    devId: "",
    devName: ""
  };

  const [teamData, setTeamData] = React.useState({});
  const [devsNotOnTeam, setDevsNotOnTeam] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [taskModalOpen, setTaskModalOpen] = React.useState(false);
  const [occurrenceModalOpen, setOccurrenceModalOpen] = React.useState(false);
  const [newTaskData, setNewTaskData] = React.useState(newTaskModel)
  const [newOccurrenceData, setNewOccurrenceData] = React.useState(newOccurrenceModel);
  const [tasksData, setTasksData] = React.useState({});
  const [occurrencesData, setOccurrencesData] = React.useState({});
  const [occurreceDetaisText, setOccurreceDetaisText] = React.useState("");
  const [occurrenceDetaisOpen, setOccurrenceDetailsOpen] =  React.useState(false);
  const [confirmRemoveDevModal, setConfirmRemoveDevModal] = React.useState(newConfirmRemoveDevModel)

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

  React.useEffect(() => {
    if(!props.isManager()) {
      getDevOccurrencesInTeam(id, props.userId)
      .then(data => setOccurrencesData(data))
      .catch(err => {
        console.log("Erro ao carregar ocorr??ncias do projeto.");
      })
    }
    
  },[id, props])

  const updateTasks = () => {
    getTasks(id)
    .then(data => setTasksData(data))
    .catch(err => {
      console.log("Erro ao carregar tarefas do time");
    })
  }

  const updateOccurrences = () => {
    getDevOccurrencesInTeam(id, props.userId)
      .then(data => setOccurrencesData(data))
      .catch(err => {
        console.log("Erro ao carregar ocorr??ncias do projeto.");
      })
  }

  const devs = teamData ? _.map(teamData.developers, (dev,i) => {
    return {
      id: dev.id,
      name: dev.name,
      document: dev.document,
      function: dev.function,
    }
  }): null;

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

  function startTask (taskId) {
    markAsStarted(taskId)
    .then(updateTasks)
    .catch(err => {
      console.log("Erro ao iniciar tarefa");
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
      <Task taskData={task} status={1} handleFinish={markAsFinished} isManager={props.isManager} key={task.id}/>
    )
  })

  const pedingTasksCards = _.map(pendingTasks, (task) => {
    return (
      <Task taskData={task} status={0} handleStart={startTask} isManager={props.isManager} key={task.id}/>
    )
  })

  const finishedTasksCards = _.map(finishedTasks, (task) => {
    return (
      <Task taskData={task} status={2} handleFinish={markAsFinished} isManager={props.isManager} key={task.id}/>
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
    .then(closeConfirmRemoveDev())
    .catch(err => {
      console.log("Erro ao remover dev ao time");
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
      Header: "A????o",
      Cell: row => (
        <button className="delete-btn" onClick={e => openConfirmeRemoveDev(row.row.original.id, row.row.original.name)} title="Remover do time"> 
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

  //confirm remove dev functions
  function openConfirmeRemoveDev(devId, devName) {
    setConfirmRemoveDevModal({
      open: true,
      devId: devId,
      devName: devName
    })
  }

  function closeConfirmRemoveDev() {
    setConfirmRemoveDevModal(newConfirmRemoveDevModel)
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
      Header: "A????o",
      Cell: row => (
        <button className="add-btn" onClick={e => addToTeam(row.row.original.id)} title="Adicionar ao time"> 
          <i className="fas fa-plus"></i>
        </button>
      )
    }
  ];

  const occurrenceDevColumns =
  [
    {
      Header: 'Data',
      accessor: 'date'
    },
    {
      Header: 'Categoria',
      accessor: 'typeText',
    },
    {
      Header: "Detalhes",
      Cell: row => (
        <button className="desc-btn" title="Detalhes da ocorr??ncia" onClick={e => openOccurrenceDeatilsModal(row.row.original.description)}> 
          <i className="fas fa-list"></i>
        </button>
      )
    }
  ];

  //modal functions
  function openOccurrenceDeatilsModal(detailsText) {
    setOccurreceDetaisText(detailsText);
    setOccurrenceDetailsOpen(true);
  }

  function closeOccurrenceDeatilsModal() {
    setOccurrenceDetailsOpen(false);
    setOccurreceDetaisText("");
  }

  const submitTaskForm = async event => {
    event.preventDefault();
    await createTask(newTaskData, id)
      .then(updateTasks)
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
      .then(setNewOccurrenceData(newOccurrenceModel))
      .then(updateOccurrences)
      .catch(err => {
        console.log("Erro ao criar ocorr??ncia");
      })
  }

  return (
    <div className="team">
      <h1> {teamData?.project} / {teamData?.teamName}</h1>
      {props.isManager() && <div>
        <div className="dev-tables">
          <h3>Membros do time</h3>
          {devs?.length >= 1 && <Table columns={columns} data={devs} />}
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
            <Tab>Conclu??das</Tab>
          </TabList>

          <TabPanel>
            {pedingTasksCards.length === 0 && <p className="no-task">Nenhuma tarefa pendente no momento</p>}
            <div className="tasks-section">
              {pedingTasksCards} 
            </div>
          </TabPanel>
          <TabPanel>
            {onGoingTasksCards.length === 0 && <p className="no-task">Nenhuma tarefa em andamento</p>}
            <div className="tasks-section">
              {onGoingTasksCards} 
            </div>
          </TabPanel>
          <TabPanel>
            {finishedTasksCards.length === 0 && <p className="no-task">Nenhuma tarefa conclu??da at?? o momento</p>}  
            <div className="tasks-section">
              {finishedTasksCards} 
            </div>      
          </TabPanel>
        </Tabs>
        
        {props.isManager() && <button className="btn-primary" onClick={openTaskModal}>Criar Tarefa</button>}
      </div>
      <br />
      {!props.isManager() && 
      <div className="">
        <h2>Suas ocorr??ncias no Time</h2>
        {occurrencesData.length === 0 && <p className="no-task">Nenhuma ocorr??ncia</p>}  
        {occurrencesData.length > 0 && <Table columns={occurrenceDevColumns} data={occurrencesData} />}
        <button className="btn-primary" onClick={openOccurrenceModal}>Nova Ocorr??ncia</button>
      </div>   
      }
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
          <label>T??tulo da Tarefa</label>
          <input 
            type="text"
            name="title"
            value={newTaskData.title}
            onChange={handleNewTaskForm}
            required
          />
          <label>C??digo da Tarefa</label>
          <input 
            type="number"
            name="code"
            value={newTaskData.code}
            onChange={handleNewTaskForm}
            required
            min={1}
            className="half"
          />
          <label>Data de conclus??o esperada</label>
          <input 
            type="date"
            name="expectedDate"
            value={newTaskData.expectedDate}
            onChange={handleNewTaskForm}
            required
            className="half"
          />
          <label>Descri????o</label>
          <textarea 
            type="text"
            name="description"
            value={newTaskData.description}
            onChange={handleNewTaskForm}
            required
          />
          <button className="btn-create">Criar</button>
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
        <h3>Nova ocorr??ncia</h3>
        <form onSubmit={submitOccurrenceForm}>
          <label>Descreva a ocorr??ncia</label>
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
            <option value={OcurrenceType.DocumentationIssue}>Problema na Documenta????o</option>
            <option value={OcurrenceType.PrototypeInconsistency}>Problema com os Prot??tipos</option>
            <option value={OcurrenceType.TechProblem}>Problema T??cnico</option>
            <option value={OcurrenceType.Testing}>Testes Ineficazes</option>
            <option value={OcurrenceType.DevToolsProblem}>Problema com as Ferramentas de Desenvolvimento</option>
            <option value={OcurrenceType.MissCommunication}>Problema de Comunica????o</option>
            <option value={OcurrenceType.CrunchTime}>Crunch (Trabalho Excessivo)</option>
            <option value={OcurrenceType.TeamConflict}>Conflitos na Equipe</option>
            <option value={OcurrenceType.RemovedFeature}>Remo????o de Funcionalidade</option>
            <option value={OcurrenceType.UnexpectedFeature}>Nova Funcionalidade de Fora do Planejamento</option>
            <option value={OcurrenceType.LowBudget}>Problema Financeiro</option>
            <option value={OcurrenceType.MissPlaning}>Problema no Planejamento e Gest??o do Projeto</option>
            <option value={OcurrenceType.SecurityProblem}>Problema de Seguran??a</option>
            <option value={OcurrenceType.PoorBuiltScope}>Problema com o Escopo do Projeto</option>
            <option value={OcurrenceType.MarketingIssue}>Problema com o Marketing</option>
            <option value={OcurrenceType.MonetizationProblem}>Problema no Planejamento de Monetiza????o</option>
          </select>
          <button className="btn-create">Criar</button>
        </form>
      </Modal>
      <Modal
        isOpen={occurrenceDetaisOpen}
        onRequestClose={closeOccurrenceDeatilsModal}
        contentLabel="Example Modal"
        className="modal occurrence-details-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeOccurrenceDeatilsModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Detalhes da ocorr??ncia</h3>
        <textarea 
          type="text"
          readOnly
          value={occurreceDetaisText}
        />
      </Modal>
      <Modal
        isOpen={confirmRemoveDevModal.open}
        onRequestClose={closeConfirmRemoveDev}
        contentLabel="Example Modal"
        className="modal warning-modal"
        overlayClassName="overlay"
      >
         <div className="warning">
              <span className="warning-icon"><i className="fas fa-times"></i></span>
              <h3 className="warning-text">Quer realmente remover [{confirmRemoveDevModal.devName}] do time?</h3>
              <button className="btn-danger" onClick={() => removeFromTeam(confirmRemoveDevModal.devId)}>Sim</button>
              <button className="btn-primary" style={{backgroundColor: '#7A4EBB'}} onClick={closeConfirmRemoveDev}>N??o</button>
            </div>
      </Modal>
    </div>
  )
}

export default Team;