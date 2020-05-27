const puppeteer = require('puppeteer')

const newUser = {
    firstname: "joao",
    lastname: "da silva sauro",
    email: "gapps.4@nacionalgrafica.com.br"
}
const config = {
    typeDelay: 50,
    waitDelay: 500,
    showLog: true
}

const describe = async (description, command) => {
    if (config.showLog) console.log(description)
    await command()
}

const random = (type) => {
    switch (type) {
        case "sex":
            return String(Math.floor(Math.random() * (+2 - +1) + +1))
            break
        case "day":
            return String(Math.floor(Math.random() * (+28 - +1) + +1))
            break
        case "password":
            let c = Date.now() / 500
            let d = c.toString(16).split(".").join("")
            while (d.length < 14) d += "0"
            let e = ""
            let a = ""
            return a + d + e
            break
        case "month":
            return String(Math.floor(Math.random() * (+12 - +1) + +1))
            break
        case "year":
            return String(Math.floor(Math.random() * (+1980 - +1992) + +1992))
            break
    }
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
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

    const page = await browser.newPage()

    const signup = async () => {
        await page.goto('https://m.facebook.com/reg', {
            waitUntil: 'networkidle2'
        })

        await describe("setando o window.navigator = {} ...", async () => {
            await page.evaluate(() => {
                window.navigator = {}
            })
        })

        await describe(`digita o nome ${newUser.firstname} ${newUser.lastname} e vai para o proximo step`, async () => {
            await page.waitForSelector("#firstname_input")
            await page.type("#firstname_input", newUser.firstname, { delay: config.typeDelay })
            await page.type("#lastname_input", newUser.lastname, { delay: config.typeDelay })
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(config.waitDelay)
        })

        let day = random("day")
        let month = random("month")
        let year = random("year")
        await describe(`define a data de nascimento ${day}/${month}/${year} e vai para o proximo step`, async () => {
            await page.waitForSelector("select[data-sigil='birthday_day']")
            await page.select("select[data-sigil='birthday_day']", day)
            await page.select("select[data-sigil='birthday_month']", month)
            await page.select("select[data-sigil='birthday_year']", year)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(config.waitDelay)
        })


        await describe(`seleciona que vai cadastrar por email`, async () => {
            await page.waitForSelector("a[data-sigil='switch_phone_to_email']")
            await page.click("a[data-sigil='switch_phone_to_email']")
            await page.waitFor(config.waitDelay)
        })

        await describe(`digita o email ${newUser.email}`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            await page.type("input[name='reg_email__']", newUser.email, { delay: config.typeDelay })
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(config.waitDelay)
        })

        let sex = random("sex")
        let sexs = ["", "Maculino", "Feminino"]
        await describe(`seleciona o sexo ${sexs[sex]}`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            page.$eval("input[name='sex'][data-value='" + sex + "']", elem => elem.click())
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(config.waitDelay)
        })

        let password = random("password")
        await describe(`digita o senha ${password}`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            await page.type("input[name='reg_passwd__']", password, { delay: config.typeDelay })
            await page.click("button[data-sigil='touchable multi_step_submit']")
            await page.waitFor(config.waitDelay)
        })
    }
    await signup()


})()

