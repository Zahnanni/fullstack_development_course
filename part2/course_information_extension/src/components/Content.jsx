import Part from './Part'
import Total from './Total'

const Content = ({parts}) => {
    console.log(parts)
    return (
        <div>
            {parts.map(part => <Part key={part.id} part={part} />)}
            <Total parts={parts} />
        </div>
    )
}

export default Content