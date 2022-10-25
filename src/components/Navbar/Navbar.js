import React from "react";
import SideNav, {Toggle,NavItem, NavIcon, NavText} from "@trendmicro/react-sidenav";
import { useNavigate } from "react-router-dom";

import './Navbar.css';
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

function Navbar() {
  const navigate = useNavigate()

  return (
      <SideNav 
        onSelect={selected => {
          navigate('/'+selected)
        }}
        className="my-navbar"
      >
        <Toggle />
        <SideNav.Nav defaultSelected="/">
          <NavItem eventKey="">
            <NavIcon>
                <i className="fa-solid fa-house" style={{ fontSize: '1.75em' , color: 'white'}} />
            </NavIcon>
            <NavText>INÍCIO</NavText>
          </NavItem>
          <NavItem eventKey="content">
            <NavIcon>
                <i className="fas fa-paperclip" style={{ fontSize: '1.75em' }} />
            </NavIcon>
            <NavText>CONTEÚDO</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
  )
}
export default Navbar;