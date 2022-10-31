import React from "react";
import Moment from 'react-moment';

import "./Task.css";

function Task(props) {
  return (
    <div className="task-card">
      <div className="header">
        <h3>{props.taskData.code} - {props.taskData.title}</h3>
      </div>
      <div className="body">
        <p>{props.taskData.description}</p>
        <p>Prazo estimado: <Moment format="DD/MM/YYYY">{props.taskData.expectedDate}</Moment></p>
      </div>
      <div className="footer">
        {props.isManager() && <span className="done-btn" onClick={()=> props.handleFinish(props.taskData.id)}><i className="fas fa-check"></i></span>}
      </div>
    </div>
  )
}

export default Task;
