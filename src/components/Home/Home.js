import React from "react";

import LogoMain from "./Logo.png";

import "./Home.css";

function Home(props) {
  return(
    <div className="home">
      <div className="home-info">
        <img alt="logo principal" src={LogoMain} className="home-logo"/> 
        <p className="home-text">Bem vindo ao GPMAA {props.userData.name}</p>
        <p className="home-text">{props.isManager() ? '[Gerente]' : '[Desenvolvedor]'}</p>
      </div> 
    </div>
  )
}

export default Home;