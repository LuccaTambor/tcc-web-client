import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ReactLoading from 'react-loading';

//components
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Developers from "./components/Developers/Developers";
import Projects from "./components/Projects/Projects";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";
import Team from "./components/Team/Team";
import Statistics from "./components/Statistics/Statistics";

function App() {
  const [userData, setUserData] = React.useState();
  const [navToggled, setNavToggled] = React.useState(false);
  const [isLoading, setIsLoading] =  React.useState(false);

  const startLoading = () => {
    setIsLoading(true);
  }

  const endLoading = () => {
    setIsLoading(false);
  }

  const loader = {
    start: startLoading,
    end: endLoading
  }

  const onToggled = () => {
    setNavToggled(prevNavToggled => !prevNavToggled);
  }

  const handleUserData = (data) => {
    setUserData(data)
  }

  const isManager = () => {
    return userData.hasOwnProperty("projects");
  };


  if(!userData) {
    return (
    <BrowserRouter>
      {isLoading && 
      <div className="loader-cointainer">
        <ReactLoading type="spin" color="#7A4EBB" className="loader"/>
      </div>}
      <Login onSetData={handleUserData} loader={loader}/>
    </BrowserRouter>
    )
  }

  const logOutUser = () => {
    setNavToggled(false);
    setUserData(null);
  }

  return (
    <div className="app">
      <BrowserRouter>
      <Navbar handleToggle={onToggled} isManager={isManager} toLogout={logOutUser}/>
      <div className={"container "  + (navToggled ? "toggled" : "")}>
        <Routes>
          <Route path="/" element={<Home userData={userData} isManager={isManager}/>}/>
          <Route path="/desenvolvedores" element={<Developers />} />
          <Route path="/projetos" element={<Projects isManager={isManager} userData={userData}/>} />
          <Route path="/detalhes-projeto/:id" element={<ProjectDetails isManager={isManager} userData={userData} />}/>
          <Route path="/time/:id" element={<Team isManager={isManager} userId={userData.id} />} />
          <Route path="/estatisticas" element={<Statistics managerId={userData.id}/>} />
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
