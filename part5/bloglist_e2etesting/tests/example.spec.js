const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    const response = await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'AGZ',
        username: 'zahnanni',
        password: '12345'
      }
    })
    await page.goto('http://localhost:5173')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'Login' }).click()
      await loginWith(page, 'zahnanni', '12345')   
      await expect(page.getByRole('button', { name: 'Logout' })).toHaveCount(1)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('link', { name: 'Login' }).click()
      await loginWith(page, 'zahnanni', 'wrong') 

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'Login' }).click()
      await loginWith(page, 'zahnanni', '12345')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'And we left', 'Sarah Libowitz', 'and-we-left.org')
      await expect(page.getByText('Added And we left successfully!')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'And we left', 'Sarah Libowitz', 'and-we-left.org')
      await page.getByRole('link', { name: 'And we left' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('only a user who created the entry can delete it', async ({ page }) => {
      await createBlog(page, 'And we left', 'Sarah Libowitz', 'and-we-left.org')
      await page.getByRole('link', { name: 'And we left' }).click()

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('And we left')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByText('Blog And we left was deleted successfully!')
      ).toBeVisible()

      await expect(
        page.getByText('And we left')
      ).not.toBeVisible()
    })

    test('only a user who created the entry sees the delete button', async ({ page, request }) => {
      await createBlog(page, 'And we left', 'Sarah Libowitz', 'and-we-left.org')
      await page.getByRole('button', { name: 'Logout' }).click()
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'wrong user',
          username: 'badman',
          password: 'bäääd'
        }
      })
      await page.getByRole('link', { name: 'Login' }).click()
      await loginWith(page, 'badman', 'bäääd')
      await page.getByRole('link', { name: 'And we left' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })
    /*
    test('the blogs are sorted according to their likes', async ({ page }) => {
      await createBlog(page, 'And we left', 'Sarah Libowitz', 'and-we-left.org')
      await createBlog(page, 'So we kept running', 'Luther', 'so-we-kept-running.org')
      await createBlog(page, 'while we talked', 'Mozart', 'while-we-talked.org')
      await page.reload()
      const blog = page
        .getByTestId('blog')
        .filter({ hasText: 'while we talked Mozart' })

      await blog.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      
      const blogs = page.getByTestId('blog')

      await expect(blogs).toHaveCount(3)

      await expect(blogs.nth(0)).toContainText('while we talked')
      await expect(blogs.nth(1)).toContainText('And we left')
      await expect(blogs.nth(2)).toContainText('So we kept running')
    })
      */
  })
})