const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})


blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  if (!request.token) { response.status(401).json({ error: 'token invalid' }) }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blogtobedeleted = await Blog.findById(request.params.id)
  if (user._id.toString() === blogtobedeleted.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(403).json({ error: 'forbidden' })
  }
})


blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    {
    returnDocument: 'after',
    runValidators: true
    }
  ).populate('user', {
  username: 1,
  name: 1})

  if (!updatedBlog) {
    return response.status(404).end()
  }

  response.json(updatedBlog)
})


module.exports = blogsRouter
