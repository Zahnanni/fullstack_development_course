const Filter = ({ newFilter, UpdateFilter }) => {

    const handleFilterChange = (event) => {
        console.log(event.target.value)
        UpdateFilter(event.target.value)
    }


    return(
        <div>find countries <input value={newFilter} onChange={handleFilterChange}/></div>
    )
}

export default Filter