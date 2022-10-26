import React from "react";
import _ from "lodash";

import './Developers.css'

import Table from "../Table/Table";

function Developers(props){
  const [developersData, setDevelopersData] = React.useState({});
  React.useEffect(() => {
    fetch('/api/users/GetDevelopers')
      .then(response => response.json())
      .then(data => setDevelopersData(data));
  }, []);

  const devs = _.forEach(developersData, dev => {
    return {
      name: dev.name,
      function: dev.function,
      document: dev.document,
      email: dev.email
    }
  })

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nome',
        accessor: 'name'
      },
      {
        Header: 'Cargo',
        accessor: 'function',
      },
      {
        Header: 'Documento',
        accessor: 'document',
      },
      {
        Header: 'Email',
        accessor: 'email'
      }
    ],
    []
  );

  return(
    <div className="developers">
      <h2 className="page-title">Desenvolvedores Cadastrados</h2>
      <div className="dev-tables">
        {devs.length >= 1 && <Table columns={columns} data={devs} />}
      </div>
      <button className="primary-btn side-button">+ Criar Novo</button>
    </div>
  );
}

export default Developers;