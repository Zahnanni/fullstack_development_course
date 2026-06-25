import { render, screen } from '@testing-library/react'
import NewBlogForm from './New_blog_form'
import userEvent from '@testing-library/user-event'

test('<NewBlogForm /> is creating new blogs correctly', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<NewBlogForm onAddBlog={createBlog} />)

  const input_title = screen.getByLabelText('title', { exact: false })
  const input_author = screen.getByLabelText('author', { exact: false })
  const input_url = screen.getByLabelText('url', { exact: false })
  const sendButton = screen.getByText('add')

  await user.type(input_title, 'testing title')
  await user.type(input_author, 'testing author')
  await user.type(input_url, 'testing url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title')
  expect(createBlog.mock.calls[0][0].author).toBe('testing author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing url')
})