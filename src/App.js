import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import styled from 'styled-components';

import CountriesPanel from './CountriesPanel';
import LanguagesPanel from './LanguagesPanel';

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

const App = () => {
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get('https://restcountries.eu/rest/v2/all')
      setCountries(res.data)
    })()
  }, []);
  console.log(countries)

  const languages = useMemo(() => {
    const langs = {}
    countries.flatMap(country => country.languages).forEach(lang => {
      langs[lang.name] = lang
      langs[lang.name].countries = []
      langs[lang.name].population = 0
    })
    countries.forEach(country => {
      country.languages.forEach(lang => {
        langs[lang.name].countries.push(country)
        langs[lang.name].population += country.population
      })
    })
    return Object.values(langs);
  }, [countries]);
  console.log('languages', languages)

  return (
    <SMain>
      <Tabs selectedTabClassName='selected' selectedTabPanelClassName='selected'>
        <STabList>
          <STab>Countries</STab>
          <STab>Languages</STab>
        </STabList>
        <STabPanel>
          <CountriesPanel countries={countries} />
        </STabPanel>
        <STabPanel>
          <LanguagesPanel languages={languages} />
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

export default App;
