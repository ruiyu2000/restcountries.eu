import { useMemo } from 'react';

import Numerical from './Numerical';
import Table from './Table';

const km2toMi2 = km2 => km2 / 2.59

const CountriesPanel = ({ countries }) => {
  const columns = useMemo(() => [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Region', accessor: 'region' },
    { Header: 'Area (mi2)', accessor: 'area', Cell: ({value}) => <Numerical>{Number(km2toMi2(value)).toFixed()}</Numerical> },
    { Header: 'Population', accessor: 'population', Cell: ({value}) => <Numerical>{Number(value/10**6).toFixed(1)}</Numerical> },
  ], []);

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
      <Table columns={columns} data={countries} />
      <div style={{ marginTop: '20px' }}>Average population: {getAveragePopulation()}</div>
      <div>Smallest area: {getSmallestArea()}</div>
      <div>Biggest area: {getBiggestArea()}</div>
    </>
  )
};

export default CountriesPanel;
