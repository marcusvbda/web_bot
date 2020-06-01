
(async () => {
    require('dotenv').config()
    const outlook = require("./src/outlook")
    await outlook.createFakeUser()
})()