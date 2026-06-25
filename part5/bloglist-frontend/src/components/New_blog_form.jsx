import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const NewBlogForm = ({ onAddBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    onAddBlog(newBlog)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="title"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <TextField
            label="url"
            value={newUrl}
            onChange={event => setNewUrl(event.target.value)}
            style={{ marginTop: 10 }}
          />
        </div>
        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            add
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewBlogForm