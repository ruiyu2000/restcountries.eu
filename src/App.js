import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import styled from 'styled-components';

/*
Fetch a list of countries with metadata using the REST URL below. Process and display the data accordingly:
List countries in a table
  Show columns: Name, Region, Area, Population
  Format the area in square metric miles, without decimals (example, for Norway “125020”)
  Format the population in millions with one decimal (example, for Norway “5.2”)
  Input option for visualization: sort by one of name, population or area
  Summary at the end: Show the population average from all the countries, and also the countries with smallest and biggest area.
List languages with the countries that speak it in a table
  Show columns: Language, Countries[], Population
*/

const km2toMi2 = km2 => km2 / 2.59

const App = () => {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get('https://restcountries.eu/rest/v2/all')
      setCountries(res.data)
    })()
  }, []);
  console.log(countries)

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
  } = useTable({ columns, data: countries });

  return (
    <SMain>
      <Tabs selectedTabClassName='selected' selectedTabPanelClassName='selected'>
        <STabList>
          <STab>Countries</STab>
          <STab>Languages</STab>
        </STabList>
        <STabPanel>
          <table style={{ width: '100%' }} {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
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
        </STabPanel>
        <STabPanel>
          Panel 2
        </STabPanel>
      </Tabs>
    </SMain>
  );
}

const SMain = styled.main`
  margin: 20px;
`;

const STabList = styled(TabList)`
  display: flex;
  list-style-type: none;
  padding: 4px;
  margin: 0;
`;
STabList.tabsRole = 'TabList';

const STab = styled(Tab)`
  margin-right: 4px;
  padding: 4px;
  border: 1px solid black;
  cursor: pointer;
  font-size: 20px;

  &.selected {
    border-bottom: 1px solid white;
  }
`;
STab.tabsRole = 'Tab';

const STabPanel = styled(TabPanel)`
  display: none;
  padding: 10px;
  margin-top: -5px;
  border: 1px solid black;
  font-size: 16px;

  &.selected {
    display: block;
  }
`;
STabPanel.tabsRole = 'TabPanel';

const Numerical = styled.div`
  width: 100%;
  text-align: right;
`;

export default App;
