import React from "react";

import './Login.css'

async function loginUser(credentials) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  
  return fetch('/api/users/login/?userName=' + credentials.userName + '&password=' + credentials.password, requestOptions)
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