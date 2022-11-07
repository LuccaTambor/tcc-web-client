import React from "react";
import SideNav, {Toggle, NavItem, NavIcon, NavText} from "@trendmicro/react-sidenav";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from 'react-modal';

import './Navbar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathNow = location.pathname.substring(1);
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);

  const openLogouModal = () => {
    setLogoutModalOpen(true);
  }

  const closeLogouModal = () => {
    setLogoutModalOpen(false);
  }

  return (
    <div className="">
      <SideNav 
        onSelect={selected => {
          navigate('/'+selected)
        }}
        className="my-navbar"
        onToggle={props.handleToggle}
      >
        <Toggle />
        <br />
        <br />
        <SideNav.Nav defaultSelected="/">
          <NavItem eventKey="">
            <NavIcon>
                <i className="fa-solid fa-house" style={{ fontSize: '1.75em' , color: 'white'}} />
            </NavIcon>
            <NavText>INÍCIO</NavText>
          </NavItem>
          {props.isManager() && <NavItem eventKey="desenvolvedores">
            <NavIcon>
                <i className="fas fa-user" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>DESENVOLVEDORES</NavText>
          </NavItem>}
          <NavItem eventKey="projetos">
            <NavIcon>
                <i className="fas fa-folder" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>PROJETOS</NavText>
          </NavItem>
          {props.isManager() && <NavItem eventKey="estatisticas">
            <NavIcon>
                <i className="fas fa-chart-bar" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>OCORRÊNCIAS E DADOS</NavText>
          </NavItem>}
          <hr />
          <NavItem eventKey={pathNow} onClick={openLogouModal}>
            <NavIcon>
                <i className="fas fa-sign-out-alt" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>SAIR</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      <Modal
        isOpen={logoutModalOpen}
        onRequestClose={closeLogouModal}
        contentLabel="Example Modal"
        className="modal logout-modal"
        overlayClassName="overlay"
      >
        <span onClick={closeLogouModal} className="close-btn"><i className="fas fa-times"></i></span>
        <h3>Deseja realmente sair?</h3>
        <div className="btns-sec">
          <button className="btn-danger" onClick={props.toLogout}>Sim <i className="fas fa-times"></i></button>
          <button className="btn-create" onClick={closeLogouModal}>Não</button>
        </div>
      </Modal>
    </div>
      
  )
}
export default Navbar;