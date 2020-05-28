const puppeteer = require('puppeteer')

const Browser = {
    browser: undefined,
    async createPage() {
        this.browser = await puppeteer.launch({
            headless: (process.env.HEADLESS.toLowerCase() == "false"),
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

        return await this.browser.newPage()
    },
    async close() {
        await this.browser.close()
    }
}
module.exports = Browser