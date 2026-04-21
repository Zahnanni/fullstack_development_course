const Part = (props) => {
  console.log(props)  
return (
      <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Header = (props) => {
  console.log(props)  
return (
      <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  console.log(props)  
return (
      <>
      <Part part={props.content[0]}/>
      <Part part={props.content[1]}/>
      <Part part={props.content[2]}/>
      </>
  )
}

const Total = (props) => {
  console.log(props)  
  const total = props.content[0].exercises + props.content[1].exercises + props.content[2].exercises
return (
      <p>Number of exercises {total}</p>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content content={course.parts}/>
      <Total content={course.parts} />
    </div>
  )
}

export default App