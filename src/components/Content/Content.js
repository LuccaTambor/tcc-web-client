import React from "react";

function Content(props){
  return(
    <div className="container">
      Bem vindo {props.userDataName}!
    </div>
  );
}

export default Content;