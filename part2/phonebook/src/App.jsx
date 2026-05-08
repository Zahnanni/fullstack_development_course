import { useState, useEffect } from 'react'
import entryService from './services/entry'
import Form from './components/Form'
import Filter from './components/Filter'
import Entries from './components/Entries'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    entryService
      .getAll()
      .then(entries => {
        console.log('promise fulfilled')
        setPersons(entries)
      })
  }, [])
  

  const addPerson = (newPerson) => {
    const exists = persons.some(
      person => person.name === newPerson.name
    )

    if (exists) {
      const message =`${newPerson.name} is already added to the phonebook, replace the old number with the new one?`
      const reaction = confirm(message)
      if (reaction) {
        const oldperson = persons.find(person => person.name === newPerson.name)
        const changedPerson = { ...oldperson, number: newPerson.number }
        entryService
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(per => per.name === changedPerson.name ? changedPerson : per))
          })
          .catch(error => {
            setNotificationMessage(
              `Information of '${changedPerson.name}' has already been removed from the server`
            )
            setNotificationType("error")
            setTimeout(() => {
              setNotificationMessage(null)
              setNotificationType(null)
            }, 5000)
            setPersons(persons.filter(per => per.name !== changedPerson.name)
            )
          })
      }

      return
    }
    
    entryService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationMessage(`Added ${returnedPerson.name}`)
        setNotificationType("successful")
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationType(null)
        }, 5000)
      })
  }


  const EntriesToShow = (newFilter.length === 0)
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const DeleteFunction = (person) => {
    console.log(`we have to delete entry ${person.id}`)
    const message = `Delete ${person.name} ?`
    const reaction = confirm(message)
    if (reaction) {
      entryService
        .deleteEntries(person.id)
        .then(response => {
          console.log(`entry ${response.name} was deleted.`)
          const updatedPersons = persons.filter(per => per.id !== person.id);
          setPersons(updatedPersons)
        })
    }

  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType}/>
      <Filter newFilter={newFilter} UpdateFilter={setNewFilter} />
      <h2>add a new</h2>
      <Form onAddPerson={addPerson} />
      <h2>Numbers</h2>
      <Entries EntriesToShow={EntriesToShow} DeleteFunction={DeleteFunction}/>
    </div>
  )
}

export default App