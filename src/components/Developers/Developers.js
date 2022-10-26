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
      document: dev.document
    }
  })

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nome',
        accessor: 'name'
      },
      {
        Header: 'Document',
        accessor: 'document',
      },
      {
        Header: 'Function',
        accessor: 'function',
      },
    ],
    []
  );

  console.log(devs.length)
  return(
    <div className="container">
      <h2 className="page-title">Desenvolvedores Cadastrados</h2>
      <button className="primary-btn">+ Criar Novo</button>
      <div className="dev-tables">
        {devs.length >= 1 && <Table columns={columns} data={devs} />}
      </div>
    </div>
  );
}

export default Developers;