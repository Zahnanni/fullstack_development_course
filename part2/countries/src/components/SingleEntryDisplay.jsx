import Weather from "./Weather"

const SingleEntryDisplay = ({ country }) => {
    console.log(country)
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital[0]}</p>
            <p>Area {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map((value) => (
                    <li key={value}>{value}</li>
                    ))}
            </ul>
            <img src={country.flags.png} alt="country flag"/>
            <Weather country={country} />
        </div>
    )
}

export default SingleEntryDisplay