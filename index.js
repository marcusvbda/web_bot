const puppeteer = require('puppeteer')
const credentials = require('./credentials')

const sleep = async (ms) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res()
        }, ms)
    })
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: null
    })
    const page = await browser.newPage()
    let login = async () => {
        // login
        await page.goto('https://facebook.com', {
            waitUntil: 'networkidle2'
        })

        await page.waitForSelector('#email')
        console.log(credentials.user)
        console.log('#email')
        await page.type('#email', credentials.user)

        await page.type('#pass', credentials.pass)
        // await sleep(500)

        await page.click("#loginbutton")

        console.log("login done")
        await page.waitForNavigation()
    }
    await login()
    await page.screenshot({
        path: 'facebook.png'
    })
})()