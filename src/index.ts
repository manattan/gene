import { exit } from 'process'
import puppeteer from 'puppeteer'

if (process.env.NODE_ENV !== 'production') {
  console.log('hi')
  require('dotenv').config()
}

;(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: false,
  })
  const page = await browser.newPage()
  await page.goto('https://genequest.jp/signin/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(10000)

  await page.waitForSelector('#m')
  await page.waitForSelector('#p')

  await page.type('#m', process.env.GENE_EMAIL || '')
  await page.type('#p', process.env.GENE_PASSWORD || '')

  await page.evaluate(async () => {
    const a = document as any
    await a.form1.submit()
  })
  await page.waitForTimeout(10000)

  const pages = await browser.pages()
  const newPage = pages[pages.length - 1]
  await newPage.evaluate(() => {
    if (window.location.href !== 'https://genequest.jp/mypage/') {
      console.log('email or password is invalid')
      exit()
    }
  })

  console.log('success for login!')
  await browser.close()
  exit(0)
})()
