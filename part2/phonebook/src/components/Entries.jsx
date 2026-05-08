const Entries = ({EntriesToShow}) => {
    return (
        <ul>
        {EntriesToShow.map(person => <li key={person.id}>{person.name} {person.number} 
          <button onClick={() => DeleteFunction(person)}>delete</button></li>) }
        
      </ul>
    )
}

export default Entries