import { useState } from 'react'

const Header = ({text}) => <h1>{text}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({stat, text}) => <tr><td>{text}</td><td>{stat}</td></tr>

const Statistics = ({total, good, neutral, bad}) => {
  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  const average = (good*1+neutral*0+bad*-1)/total
  const perc = good/total*100 + " %"

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine stat={good} text="good"/>
          <StatisticLine stat={neutral} text="neutral"/>
          <StatisticLine stat={bad} text="bad"/>
          <StatisticLine stat={total} text="all"/>
          <StatisticLine stat={average} text="average"/>
          <StatisticLine stat={perc} text="positive"/>
        </tbody>
      </table>
    </div>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const HandleGoodFeedback = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }

  const HandleNeutralFeedback = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }

  const HandleBadFeedback = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }

  
  return (
    <div>
      <Header text="give feedback"/>
      <Button onClick={HandleGoodFeedback} text="good"/>
      <Button onClick={HandleNeutralFeedback} text="neutral"/>
      <Button onClick={HandleBadFeedback} text="bad"/>
      <Header text="statistics"/>
      <Statistics total={total} good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App