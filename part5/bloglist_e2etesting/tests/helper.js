const loginWith = async (page, username, password)  => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'New blog' }).click()
  await page.getByLabel('title', { exact: false }).fill(title)
  await page.getByLabel('author', { exact: false }).fill(author)
  await page.getByLabel('url', { exact: false }).fill(url)
  await page.getByRole('button', { name: 'add' }).click()
}

export { loginWith, createBlog }