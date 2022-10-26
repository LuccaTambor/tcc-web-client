import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

//components
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Developers from "./components/Developers/Developers";

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

  if(!userData) {
    return <Login onSetData={handleUserData}/>
  }

  return (
    <div className={"container "  + (navToggled ? "toggled" : "")}>
      <BrowserRouter>
      <Navbar handleToggle={onToggled}/>
        <Routes>
          <Route path="/" />
          <Route path="/desenvolvedores" element={<Developers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
