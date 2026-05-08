import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
    console.log(country)

    const api_key = import.meta.env.VITE_SOME_KEY
    const [weather, setWeather] = useState(null)
    const latitude = country.capitalInfo.latlng[0]
    const longitude = country.capitalInfo.latlng[1]

    useEffect(() => {
        console.log('effect')
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`)
            .then(response => {
                console.log('promise fulfilled')
                console.log(response.data)
                setWeather(response.data)
            })
    }, [])
    
    if (weather === null) { 
        return null 
    }

    return(
        <div>
            <h2>Weather in {country.capital[0]}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
            />
            <p>Wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather