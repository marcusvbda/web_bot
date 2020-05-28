const facebook = {
    helper: require("./core/helper"),
    browser: require("./core/browser"),
    async signup(newUser) {
        const page = await this.browser.createPage()

        await this.helper.describe("acessa o facebook e seta o window.navigator = {} ...", async () => {
            await page.goto('https:/facebook.com/reg', {
                waitUntil: 'networkidle2'
            })
            await page.evaluate(() => {
                window.navigator = {}
            })
        })

        newUser.password = newUser.password ? newUser.password : this.helper.random("password")
        newUser.birthday_day = newUser.birthday_day ? String(newUser.birthday_day) : this.helper.random("day")
        newUser.birthday_month = newUser.birthday_month ? String(newUser.birthday_month) : this.helper.random("month")
        newUser.birthday_year = newUser.birthday_year ? String(newUser.birthday_year) : this.helper.random("year")
        newUser.sex = newUser.sex ? (newUser.sex.toLowerCase() == "f" ? 2 : 1) : this.helper.random("sex")

        await this.helper.describe("preenche o formulário de cadastro ...", async () => {
            await page.waitForSelector("input[name='firstname']")
            await page.type("input[name='firstname']", newUser.firstname)
            await page.type("input[name='lastname']", newUser.lastname)
            await page.type("input[name='reg_email__']", newUser.email)

            await page.waitForSelector("input[name='reg_email_confirmation__']")
            await page.type("input[name='reg_email_confirmation__']", newUser.email)
            await page.type("input[name='reg_passwd__']", newUser.password)

            await page.select("select[name='birthday_day']", newUser.birthday_day)
            await page.select("select[name='birthday_month']", newUser.birthday_month)
            await page.select("select[name='birthday_year']", newUser.birthday_year)

            page.$eval(`input[type='radio'][name='sex'][value='${newUser.sex}']`, elem => elem.click())
            await page.click("button[name='websubmit']")

            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        newUser.sex = newUser.sex == 1 ? "Feminino" : "Masculino"

        await this.helper.describe("conta criada ...", async () => {
            console.log(newUser)
            // await this.browser.close()
        })

    }
}

module.exports = facebook