import { Button, Box } from '@mui/material'


const Blog = ({ blog, user, BlogUpdate, BlogDelete }) => {
  const DisplayRemoveButton = () => {
    return user && blog.user.username === user.username
  }

  if(!blog) {
    return null
  }

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <div data-testid="blog">
        <h2>{blog.author}: {blog.title}</h2>
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
          </div>
          <div>Added by {blog.user.name}
          </div>
          {user && (
            <Button onClick={() => BlogUpdate(blog.id)} variant="contained" style={{ margin: 10 }}>
              like
            </Button>)
          }
          {DisplayRemoveButton() && (
            <Button onClick={() => BlogDelete(blog.id)} variant="outlined" color="error" style={{ margin: 10 }}>
              remove
            </Button>
          )}
        </div>
      </div>
    </Box>
  )
}

export default Blog