import { useState } from 'react'

const Form = ({ onAddPerson }) => {
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const addEntry = (event) => {
        event.preventDefault()
        
        const newPerson = {
            name: newName,
            number: newNumber,
            id: Date.now()
            }    

        onAddPerson(newPerson)

        setNewName('')
        setNewNumber('')
        }

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    return (
        <form onSubmit={addEntry}>
            <div>
            name: <input value={newName} onChange={handleNameChange}/>
            </div>
            <div>number: <input value={newNumber}  onChange={handleNumberChange}/></div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}

export default Form