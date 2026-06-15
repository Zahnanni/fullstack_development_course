const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    const sumLikes = blogs.reduce((accumulator, current) => accumulator + current.likes, 0)
    return sumLikes
}

const favouriteBlog = (blogs) => {
    const favBlog = blogs.reduce((max, current) => current.likes > max.likes ? current : max)
    return favBlog
}

const mostBlogs = (blogs) => {
    const blogsgrouped = _.groupBy(blogs, 'author')
    const [mostblogsauthor, arrayofblogs] = _.maxBy(Object.entries(blogsgrouped), ([key, arr]) => arr.length)
    return {
        "author" : mostblogsauthor,
        "blogs" : arrayofblogs.length
    }
}

const mostLikes = (blogs) => {
    const blogsgrouped = _.groupBy(blogs, 'author')
    const [mostLikesAuthor, bloglist] = _.maxBy(Object.entries(blogsgrouped), ([author, blogs]) => _.sumBy(blogs, 'likes'))
    const numLikes = _.sumBy(bloglist, 'likes');
    
    return {
        "author" : mostLikesAuthor,
        "likes" : numLikes
    }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}