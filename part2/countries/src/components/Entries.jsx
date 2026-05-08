import SingleEntryDisplay from "./SingleEntryDisplay"

const Entries = ({CountriesToShow, SelectSingleCountry}) => {

    if (CountriesToShow.length > 10) {
        return (
            <p>Too many matches, specify another filter</p>
        )
    }
    
    else if (CountriesToShow.length > 1) {
        return (
            <div>
            {CountriesToShow.map(country => <p key={country.cca3}>{country.name.common}
                <button onClick={() => SelectSingleCountry(country)}>show</button></p>)}
            </div>
        )
    }
    
    else if (CountriesToShow.length === 1) {
        return (
            <SingleEntryDisplay country={CountriesToShow[0]} />
    )
    }

    else {
        <p>No matches found</p>
    }
    
}

export default Entries