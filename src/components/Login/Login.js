import React from "react";

import './Login.css'
import Logo from '../../assets/images/Logo.png';
import { config } from '../../config/Constants.js'

const URL = config.url.API_URL;

async function loginUser(credentials) {
  return fetch(URL +'/api/users/login', {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(data => data.json())
    .catch(err => {
      console.error(err);
    });
}

function Login(props) {
  const [loginForm, setLoginForm] = React.useState({
    userName: "",
    password: "",
  });

  const handleLoginForm= (event) => {
    const {name, value} = event.target;
    setLoginForm(prevLoginForm => {
      return {
        ...prevLoginForm,
        [name]: value
      }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault();
   await loginUser(loginForm)
      .then(token => props.onSetData(token))
      .catch(err => {
        console.log("Erro ao logar");
      })
  }

  return (
    <div className="login-page">
      <div className="login-form">
        <img alt="log" src={Logo} className="logo"/>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="insira seu usuário"
            value={loginForm.userName}
            name="userName"
            onChange={handleLoginForm}
            required
          />
          <input
            type="password"
            placeholder="insira sua senha"
            value={loginForm.password}
            name="password"
            onChange={handleLoginForm}
            required
          />
          <button>Entrar</button>
        </form>
      </div>
    </div>  
  );
}

export default Login;