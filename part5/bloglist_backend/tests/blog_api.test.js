const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    const savedUser = await user.save()
    
    const blogs = helper.initialBlogs.map(blog => ({
    ...blog,
    user: savedUser._id
  }))

  await Blog.insertMany(blogs)
  })

  test('right number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier property is called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert(Object.hasOwn(blog, 'id'))
    })
  })

  test('a new blog entry can be added ', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })
    
    const newBlog = {
      title: 'The Man on the Moon',
      author: 'Alexander Sobschyzn',
      url: 'http://the-man-on-the-moon.org',
      likes: 25
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const listblogsindb = await helper.blogsInDb()
    assert.strictEqual(listblogsindb.length, helper.initialBlogs.length + 1)
    const contents = listblogsindb.map(b => b.title)
    assert(contents.includes('The Man on the Moon'))
  })

  test('a new blog entry without the property likes has the default of 0 ', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })

    const newBlog = {
      title: 'The Man on the Moon',
      author: 'Alexander Sobschyzn',
      url: 'http://the-man-on-the-moon.org'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const listblogsindb = await helper.blogsInDb()
    const newblogentry = listblogsindb.find(b => b.title === "The Man on the Moon")
    assert(newblogentry.likes === 0)
  })

  test('a new blog entry without title or url returns a 400 error ', async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })

    const newBlog = {
      title: 'The Man on the Moon',
      author: 'Alexander Sobschyzn',
      likes: 25,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('a new blog entry without a right token returns a 401 error ', async () => {

    const newBlog = {
      title: 'The Man on the Moon',
      author: 'Alexander Sobschyzn',
      likes: 25,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('deletes blog entry with status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log(blogToDelete)
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

  test('updates blog entry', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogUpdate =  {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 9,
    }
    const blogtobeupdated = blogsAtStart.find(b => b.title === "React patterns")
    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root',
        password: 'sekret'
      })

    await api.put(`/api/blogs/${blogtobeupdated.id}`).set('Authorization', `Bearer ${loginResponse.body.token}`).send(blogUpdate).expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogupdated = blogsAtEnd.find(b => b.title === "React patterns")

    assert.strictEqual(blogupdated.likes, blogUpdate.likes)
  })


})


after(async () => {
  await mongoose.connection.close()
})