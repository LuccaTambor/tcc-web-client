import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

//components
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Developers from "./components/Developers/Developers";
import Projects from "./components/Projects/Projects";
import ProjectDetails from "./components/ProjectDetails/ProjectDetails";

function App() {
  const [userData, setUserData] = React.useState();
  const [navToggled, setNavToggled] = React.useState(false);

  const onToggled = () => {
    setNavToggled(prevNavToggled => !prevNavToggled);
    console.log(navToggled)
  }

  const handleUserData = (data) => {
    setUserData(data)
  }

  const isManager = () => {
    return userData.hasOwnProperty("projects");
  };

  if(!userData) {
    return <Login onSetData={handleUserData}/>
  }

  return (
    <div className={"container "  + (navToggled ? "toggled" : "")}>
      <BrowserRouter>
      <Navbar handleToggle={onToggled} isManager={isManager}/>
        <Routes>
          <Route path="/" />
          <Route path="/desenvolvedores" element={<Developers />} />
          <Route path="/projetos" element={<Projects isManager={isManager} userData={userData}/>} />
          <Route path="/detalhes-projeto/:id" element={<ProjectDetails />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
