const puppeteer = require('puppeteer')

const Browser = {
    browser: undefined,
    page: undefined,
    async createPage(headless = undefined) {
        this.browser = await puppeteer.launch({
            headless: (headless != undefined) ? headless : (process.env.HEADLESS.toLowerCase() == "true"),
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
            ],
            ignoreHTTPSErrors: true,
            defaultViewport: null,
            ignoreDefaultArgs: ["--enable-automation"],
        })
        this.page = await this.browser.newPage()
        await this.makeStealth()
    },
    async makeStealth() {
        await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36')
        await this.page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            })
            const chromeResult = {
                loadTimes() { },
                csi() { }
            }
            Object.defineProperty(window, 'chrome', {
                get: () => chromeResult
            })
            Object.defineProperty(navigator, 'languages', {
                get: () => ["en-US", "en", "pt"],
            })
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2]
            })
        })
    },
    async close() {
        await this.browser.close()
    },
    async goto(route) {
        const context = this.browser.defaultBrowserContext()
        await context.overridePermissions(route, ['notifications'])
        await this.page.goto(route, {
            waitUntil: 'networkidle2'
        })
    },
    async waitFor(element) {
        await this.page.waitForSelector(element)
    },
    async type(element, value) {
        await this.page.type(element, value, { delay: this.getTime(0, 300) })
        await this.page.waitFor(this.getTime(0, 500))
    },
    async select(element, value) {
        await this.page.select(element, value)
        await this.page.waitFor(this.getTime(0, 500))
    },
    async click(element) {
        await this.page.click(element)
        await this.page.waitFor(this.getTime(0, 500))
    },
    async executeScript(callback, args = {}) {
        let result = await this.page.evaluate(callback, args)
        await this.page.waitFor(this.getTime(0, 500))
        return result
    },
    async radio(element, value) {
        await this.executeScript(({ value, element }) => {
            document.querySelector(`${element}[value='${value}']`).click()
        }, { value, element })
        await this.page.waitFor(this.getTime(0, 500))
    },
    getTime(min, max) {
        if (process.env.HUMANIZE != "true") return 0
        return (Math.random() * (+max - +min) + +min)
    },
    async stealth_test() {
        const headless = true
        await this.createPage(headless)

        await this.goto('https://intoli.com/blog/not-possible-to-block-chrome-headless/chrome-headless-test.html')
        await this.waitFor("#user-agent-result")
        console.log("runing stealth test .............\n")

        let test = {}

        test.user_agent = await this.executeScript(() => document.querySelector("#user-agent-result").classList.contains("passed"))
        console.log(`userAgent ............... ${test.user_agent ? 'ok' : 'failed'}`)

        test.web_driver = await this.executeScript(() => document.querySelector("#webdriver-result").classList.contains("passed"))
        console.log(`webdriver ............... ${test.web_driver ? 'ok' : 'failed'}`)

        test.chrome_result = await this.executeScript(() => document.querySelector("#chrome-result").classList.contains("passed"))
        console.log(`chrome result............ ${test.chrome_result ? 'ok' : 'failed'}`)

        test.permission_result = await this.executeScript(() => document.querySelector("#permissions-result").classList.contains("passed"))
        console.log(`permission result........ ${test.permission_result ? 'ok' : 'failed'}`)

        test.plugins = await this.executeScript(() => document.querySelector("#plugins-length-result").classList.contains("passed"))
        console.log(`plugins length........... ${test.plugins ? 'ok' : 'failed'}`)

        test.language = await this.executeScript(() => document.querySelector("#languages-result").classList.contains("passed"))
        console.log(`language length.......... ${test.language ? 'ok' : 'failed'}`)

        if (headless) await this.close()
    }
}
module.exports = Browser