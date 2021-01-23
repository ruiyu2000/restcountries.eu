import { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import styled from 'styled-components';

const km2toMi2 = km2 => km2 / 2.59

const CountriesPanel = ({ countries }) => {
  const columns = useMemo(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Region', accessor: 'region' },
    { Header: 'Area (mi2)', accessor: 'area', Cell: ({value}) => <Numerical>{Number(km2toMi2(value)).toFixed()}</Numerical> },
    { Header: 'Population', accessor: 'population', Cell: ({value}) => <Numerical>{Number(value/10**6).toFixed(1)}</Numerical> },
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: countries }, useSortBy);

  const getAveragePopulation = () => countries
    .map(country => country.population)
    .reduce((a, b) => a + b, 0)
    / countries.length
  
  const getSmallestArea = () => {
    const smallest = countries
      .slice(0)
      .filter(country => country.area !== null)
      .sort((a, b) => a.area - b.area)
      [0]
    return smallest && `${smallest.name} (${smallest.area})`
  }  

  const getBiggestArea = () => {
    const biggest = countries
      .slice(0)
      .filter(country => country.area !== null)
      .sort((a, b) => b.area - a.area)
      [0]
    return biggest && `${biggest.name} (${biggest.area})`
  }

  return (
    <>
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

      <div style={{ marginTop: '20px' }}>Average population: {getAveragePopulation()}</div>
      <div>Smallest area: {getSmallestArea()}</div>
      <div>Biggest area: {getBiggestArea()}</div>
    </>
  )
};

const Numerical = styled.div`
  width: 100%;
  text-align: right;
`;

export default CountriesPanel;
