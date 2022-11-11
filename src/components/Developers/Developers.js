import React from "react";
import _ from "lodash";
import Modal from 'react-modal';

import './Developers.css'

import Table from "../Table/Table";

import { config } from "../../config/Constants.js";
const URL = config.url.API_URL;

async function createDev(newDev) {
  return fetch(URL + '/api/users/CreateDeveloper', {
    method: "POST",
    body: JSON.stringify(newDev),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .catch(err => {
    console.error(err);
  });
}

async function deleteDev(devId) {
  return fetch(URL + '/api/users/deleteDev?id=' + devId, {
    method: "DELETE"
  })
  .then((res) => {
    if (res.status === 400) {
      throw new Error('Error in login');
    }
  })
}

async function getDevelopers() {
  return fetch(URL + '/api/users/GetDevelopers')
}

Modal.setAppElement('#root');

function Developers(props){
  const newDeveloper = {
    name: "",
    userName: "",
    email: "",
    document: "",
    function: "",
    password: "",
    confirmPassword: ""
  }

  const [unmatchedPassword, setUnmatchedPassword] =  React.useState(false);
  const [developersData, setDevelopersData] = React.useState({});
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [newDevData, setNewDevData] = React.useState(newDeveloper);
  const [warningModalOpen, setWarningModalOpen] =React.useState(false);

  const openWarning = () => {
    setWarningModalOpen(true);
  }

  const closeWarning = () => {
    setWarningModalOpen(false);
  }
  React.useEffect(() => {
    getDevelopers()
      .then(response => response.json())
      .then(data => setDevelopersData(data));
  }, []);

  const devs = _.forEach(developersData, dev => {
    return {
      name: dev.name,
      function: dev.function,
      document: dev.document,
      email: dev.email
    }
  })

  const updateDevs = () => {
    getDevelopers()
      .then(response => response.json())
      .then(data => setDevelopersData(data));
  }

  const removeDev = async (devId) => {
    await deleteDev(devId)
    .then(updateDevs)
    .catch(err => {
      openWarning()
      console.log("Não é possível deletar este desenvolvedor!");
    })
  }

  const columns =[
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
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: "Ação",
      Cell: row => (
        <button className="delete-btn" onClick={e => removeDev(row.row.original.id)} title="Remover do time"> 
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

  const handleNewDevForm = (event) => {
    const {name, value} = event.target;
    setNewDevData(prevNewDevData => {
      return {
        ...prevNewDevData,
        [name]: value
      }
    })
  }

  const submitDevForm = async event => {
    event.preventDefault();

    if(newDevData.password === newDevData.confirmPassword) {
      setUnmatchedPassword(false);
      await createDev(newDevData)
        .then(response => response.json())
        .then(data => setDevelopersData(data))
        .then(closeModal())
        .then(setNewDevData(newDeveloper))
        .catch(err => {
          console.log("Erro ao criar novo time");
      })
    }
    else {
      setUnmatchedPassword(true);
    }
  }

  return(
    <div className="developers">
      <h2 className="page-title">Desenvolvedores Cadastrados</h2>
      <div className="dev-tables">
        {devs.length >= 1 && <Table columns={columns} data={devs} />}
      </div>
      <button className="btn-primary" onClick={openModal}>+ Criar Novo</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="modal dev-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Inserir novo Desenvolvedor</h3>
        <form onSubmit={submitDevForm}>
          <input 
            type="text"
            value={newDevData.name}
            onChange={handleNewDevForm}
            placeholder="Nome do desenvolvedor"
            name="name"
            required
          />
          <input 
            type="text"
            value={newDevData.userName}
            onChange={handleNewDevForm}
            placeholder="Usuário"
            name="userName"
            required
          />
          <input 
            type="email"
            value={newDevData.email}
            onChange={handleNewDevForm}
            placeholder="Email"
            name="email"
            required
          />
          <div className="password-inputs">
            <input 
              type="password"
              value={newDevData.password}
              onChange={handleNewDevForm}
              placeholder="senha"
              name="password"
              required
            />
            <input 
              type="password"
              value={newDevData.confirmPassword}
              onChange={handleNewDevForm}
              placeholder="confirmar senha"
              name="confirmPassword"
              required
              className="confirm-password"
            />
            
          </div>
          {unmatchedPassword && <p className="wrong-password">Senhas devem ser iguais</p>}
          <input 
            type="text"
            value={newDevData.document}
            onChange={handleNewDevForm}
            placeholder="CPF"
            name="document"
            required
          />
          <input 
            type="text"
            value={newDevData.function}
            onChange={handleNewDevForm}
            placeholder="Cargo do desenvolvedor"
            name="function"
            required
          />
          <button className="btn-create btn-save">Criar</button>
        </form>
      </Modal>
      <Modal
        isOpen={warningModalOpen}
        onRequestClose={closeWarning}
        contentLabel="Example Modal"
        className="modal warning-modal"
        overlayClassName="overlay"
      >
        <div className="warning">
          <span className="warning-icon"><i className="fas fa-times"></i></span>
          <h3 className="warning-text">Não é possível deletar este desenvolvedor, ele possui times e ocorências!</h3>
          <button className="btn-danger" onClick={closeWarning}>OK</button>
        </div>
      </Modal>
    </div>
  );
}

export default Developers;