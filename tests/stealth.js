
(async () => {
    require('dotenv').config()
    const browser = require("../src/core/browser")

    await browser.stealth_test()
})()