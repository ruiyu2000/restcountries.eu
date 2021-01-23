import { useMemo } from 'react';

import Numerical from './Numerical';
import Table from './Table';

const LanguagesPanel = ({ languages }) => {
  const columns = useMemo(() => [
    { Header: 'Language', accessor: 'name' },
    { Header: 'Countries', accessor: 'countries', disableSortBy: true, Cell: ({ value }) => value.map(c => c.name).join(', ') },
    { Header: 'Population', accessor: 'population', Cell: ({value}) => <Numerical>{Number(value/10**6).toFixed(1)}</Numerical> },
  ], []);

  return (
    <Table columns={columns} data={languages} />
  )
};

export default LanguagesPanel;
