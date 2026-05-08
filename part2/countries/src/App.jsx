import { useState, useEffect } from 'react'
import CommunicateServer from './services/CommunicateServer'
import Filter from './components/Filter'
import Entries from './components/Entries'


const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    CommunicateServer
      .getAll()
      .then(response => {
        console.log('data collected')
        setCountries(response)
      })
  }, [])

  const CountriesToShow = (newFilter.length === 0)
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))

  const SelectSingleCountry = (country) => {
    setNewFilter(country.name.common)
  }

  console.log('render', countries.length, 'countries')
  return (
    <div>
      <Filter newFilter={newFilter} UpdateFilter={setNewFilter} />
      <Entries CountriesToShow={CountriesToShow} SelectSingleCountry={SelectSingleCountry} />
    </div>
  )
}

export default App 