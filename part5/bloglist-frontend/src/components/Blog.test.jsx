import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('imformation are shown to unauthenticated users but not buttons', () => {
  const blog = {
    title: 'Component testing',
    author: 'Ali Baba',
    url: 'component-testing.org',
    likes: 4,
    user: {
      name: 'Alfred',
      username: 'Alfredo'
    }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('Ali Baba: Component testing')).toBeInTheDocument()
  expect(screen.getByText('component-testing.org')).toBeInTheDocument()
  expect(screen.getByText('4', { exact: false })).toBeInTheDocument()

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('remove')).toBeNull()
})

test('authenticated users who did not create the entry see only the like button', () => {
  const blog = {
    title: 'Component testing',
    author: 'Ali Baba',
    url: 'component-testing.org',
    likes: 4,
    user: {
      name: 'Alfred',
      username: 'Alfredo'
    }
  }

  const loggedInUser = {
    username: 'someoneElse',
    name: 'Alfredo junior'
  }

  render(<Blog blog={blog} user={loggedInUser} />)

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.queryByText('remove')).toBeNull()
})

test('user who created the blog sees the delete and the like button', () => {
  const blog = {
    title: 'Component testing',
    author: 'Ali Baba',
    url: 'component-testing.org',
    likes: 4,
    user: {
      name: 'Alfred',
      username: 'Alfredo'
    }
  }

  const loggedInUser = {
    username: 'Alfredo',
    name: 'Alfred'
  }

  render(<Blog blog={blog} user={loggedInUser} />)

  expect(screen.getByText('like')).toBeInTheDocument()
  expect(screen.getByText('remove')).toBeInTheDocument()
})


test('if the like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'Component testing',
    author: 'Ali Baba',
    url: 'component-testing.org',
    likes: 4,
    user: { name: 'Alfred',
      username: 'Alfredo',
      id: 'iusfqiurgt32875'
    }
  }

  const loggedInUser = {
    username: 'Alfredo',
    name: 'Alfred'
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={loggedInUser} BlogUpdate={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})