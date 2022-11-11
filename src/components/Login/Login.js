import React from "react";
import { useNavigate } from "react-router-dom";

import './Login.css'
import Logo from './Logo.png';
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
    .then((res) => {
      if (res.status === 400) {
        throw new Error('Error in login');
      }
      return res.json();
    })
}

function Login(props) {
  const navigate = useNavigate();
  const [failedLogin, setFailedLogin] =  React.useState(false);
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
    props.loader.start();
    setFailedLogin(false)
    await loginUser(loginForm)
      .then(token => props.onSetData(token))
      .then(navigate('/'))
      .then(props.loader.end)
      .catch(err => {
        console.log("Erro ao logar");
        setFailedLogin(true);
        props.loader.end()
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
          {failedLogin && <p className="warning">Usuário ou senha incorretos</p>}
        </form>
      </div>
    </div>  
  );
}

export default Login;