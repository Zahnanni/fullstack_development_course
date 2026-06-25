import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate, useMatch
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button } from '@mui/material'

import Blog from './components/Blog'
import BlogList from './components/BlogList'
import Login from './components/login'
import NewBlogForm from './components/New_blog_form'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotification] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(note => note.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
    } catch (error) {
      setNotification({ text: 'Wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      console.log(error)
    }
  }


  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedNoteappUser')
    navigate('/')
  }

  const onAddBlog = (newBlog) => {
    blogService.create(newBlog)
      .then(returnedBlog => {
        const blogWithUser = {
          ...returnedBlog, user
        }
        setBlogs(blogs.concat(blogWithUser))
        navigate('/')
        setNotification({ text: `Added ${blogWithUser.title} successfully!`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        setNotification({ text: `Error '${error}'`, type: 'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const UpdateBlog = id => {
    const blog = blogs.find((b => b.id === id))
    const changedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch((error) => {
        setNotification({ text: `Error '${error}'`, type: 'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const DeleteBlog = id => {
    const blog = blogs.find((b => b.id === id))
    if (confirm(`You are sure, you want to delete the blog "${blog.title}"?`)) {
      blogService
        .deletion(blog.id)
        .then (() => {
          setBlogs(blogs.filter(blog => blog.id !== id ))
          navigate('/')
          setNotification({ text: `Blog ${blog.title} was deleted successfully!`, type: 'success' })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch((error) => {
          setNotification({ text: `Error '${error}'`, type: 'error' })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }


  return (
    <Container>
      <div>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} to="/" sx={style}>blogs</Button>
              {user && (
                <Button color="inherit" component={Link} to="/create" sx={style}>New blog</Button>
              )}
              {user ? (
                <Button color="inherit" onClick={handleLogout} sx={style}>Logout</Button>
              ) : (
                <Button color="inherit" component={Link} to="/login" sx={style}>Login</Button>
              )}
            </Toolbar>
          </AppBar>
        </div>
        <Notification message={notificationMessage}/>
        <Routes>
          <Route path="/" element={
            <BlogList blogs={blogs}/>
          } />
          <Route path="/blogs/:id" element={
            <Blog blog={blog} user={user} BlogUpdate={UpdateBlog} BlogDelete={DeleteBlog}/>
          } />
          <Route path="/login" element={
            <Login handleLogin={handleLogin}/>
          } />
          <Route path="/create" element={
            <NewBlogForm onAddBlog={onAddBlog}/>
          } />
        </Routes>
      </div>
    </Container>
  )
}

export default App