import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"

//components
import Login from "./components/Login/Login";
import Content from "./components/Content/Content";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [userData, setUserData] = React.useState();

  const handleUserData = (data) => {
    setUserData(data)
  }

  if(!userData) {
    return <Login onSetData={handleUserData}/>
  }

  return (
    <div>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" />
          <Route path="/content" element={<Content userDataName={userData.name} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
