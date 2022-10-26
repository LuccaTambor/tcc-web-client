import React from "react";
import SideNav, {Toggle, NavItem, NavIcon, NavText} from "@trendmicro/react-sidenav";
import { useNavigate } from "react-router-dom";

import './Navbar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

function Navbar(props) {
  const navigate = useNavigate()

  return (
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
          <NavItem eventKey="desenvolvedores">
            <NavIcon>
                <i className="fas fa-user" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>DESENVOLVEDORES</NavText>
          </NavItem>
          <NavItem eventKey="projetos">
            <NavIcon>
                <i className="fas fa-folder" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>PROJETOS</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
  )
}
export default Navbar;