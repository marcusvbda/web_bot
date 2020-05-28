const webdriver = require('selenium-webdriver')
require('chromedriver')
const chrome = require('selenium-webdriver/chrome')

const Browser = {
    browser: undefined,
    keys: webdriver.Key,
    async createPage() {
        this.browser = new webdriver.Builder()
            .setChromeOptions(this.getOptions())
            .withCapabilities(webdriver.Capabilities.chrome())
            .build()
        return this
    },
    getOptions() {
        let options = new chrome.Options()
        options.addArguments("--no-sandbox")
        options.excludeSwitches('enable-automation')
        if (process.env.HEADLESS.toLowerCase() == 'true') options.addArguments('--headless')
        return options
    },
    async close() {
        await this.browser.quit()
    }
}
module.exports = Browser