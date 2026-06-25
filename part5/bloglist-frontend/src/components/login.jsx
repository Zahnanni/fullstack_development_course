import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (event) => {
    event.preventDefault()

    await handleLogin(username, password)

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={submit}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            value={password}
            type="password"
            onChange={event => setPassword(event.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
        </Button>
      </form>
    </div>
  )
}

export default Login