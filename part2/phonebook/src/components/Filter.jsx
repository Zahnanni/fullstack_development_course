const Filter = ({ newFilter, UpdateFilter }) => {

    const handleFilterChange = (event) => {
        console.log(event.target.value)
        UpdateFilter(event.target.value)
    }


    return(
        <div>filter shown with <input value={newFilter} onChange={handleFilterChange}/></div>
    )
}

export default Filter