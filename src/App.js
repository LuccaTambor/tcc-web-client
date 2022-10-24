import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

//components
import Login from "./components/Login/Login";
import Content from "./components/Content/Content";

function App() {
  const [userData, setUserData] = React.useState();


  function handleUserData(data) {
    setUserData(data)
  }

  if(!userData) {
    return <Login onSetData={handleUserData}/>
  }

  return (
    <div>
      <h1>Application</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Content yourName={userData}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
