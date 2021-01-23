import { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';

import Numerical from './Numerical';

const LanguagesPanel = ({ languages }) => {
  const columns = useMemo(() => [
    { Header: 'Language', accessor: 'name' },
    { Header: 'Countries', accessor: 'countries', disableSortBy: true, Cell: ({ value }) => value.map(c => c.name).join(', ') },
    { Header: 'Population', accessor: 'population', Cell: ({value}) => <Numerical>{Number(value/10**6).toFixed(1)}</Numerical> },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: languages }, useSortBy);

  return (
    <table style={{ width: '100%' }} {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {column.isSorted && (column.isSortedDesc ? '▼' : '▲')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
};

export default LanguagesPanel;
