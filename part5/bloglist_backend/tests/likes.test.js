const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
    test('of empty list is zero', () => {
    const blogs = []

    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 0)
    })
    test('when list has only one entry equals the likes of that', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }]
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 5)
    })
    test('of a bigger list is caluclated right', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
            },
            {
                _id: '5a422aa71b54a67623423454',
                title: 'The Man on the Moon',
                author: 'Alexander Sobschyzn',
                url: 'http://the-man-on-the-moon.org',
                likes: 25,
                __v: 0
            }
        ]

        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 30)
    })
})

describe('Selects the favourite blog', () => {
    test('when list has only one entry it gives out that one', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
            }
        ]

        const result = listHelper.favouriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[0])
    })
    test('when there are multiple blogs and a clear winner', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
            },
            {
                _id: '5a422aa71b54a67623423454',
                title: 'The Man on the Moon',
                author: 'Alexander Sobschyzn',
                url: 'http://the-man-on-the-moon.org',
                likes: 25,
                __v: 0
            }
        ]
        const result = listHelper.favouriteBlog(blogs)
        assert.deepStrictEqual(result, blogs[1])
    })
    test('when there are multiple blogs and no clear winner', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
            },
            {
                _id: '5a422aa71b54a67623423454',
                title: 'The Man on the Moon',
                author: 'Alexander Sobschyzn',
                url: 'http://the-man-on-the-moon.org',
                likes: 25,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234234654',
                title: 'The Umbrella Conspiracy',
                author: 'Max Wellington',
                url: 'http://the-umbrella-conspiracy.org',
                likes: 25,
                __v: 0
            }
        ]
        const result = listHelper.favouriteBlog(blogs)
        let matches = false

        try {
        assert.deepStrictEqual(result, blogs[1])
        matches = true
        } catch {}

        try {
        assert.deepStrictEqual(result, blogs[2])
        matches = true
        } catch {}

        assert(matches)
    })
})