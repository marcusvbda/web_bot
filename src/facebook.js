const facebook = {
    helper: require("./core/helper"),
    browser: require("./core/browser"),
    async signup(newUser) {
        const page = await this.browser.createPage()
        await this.helper.describe("acessa o facebook e seta o window.navigator = {} ...", async () => {
            await page.goto('https://m.facebook.com/reg', {
                waitUntil: 'networkidle2'
            })
            await page.evaluate(() => {
                window.navigator = {}
            })
        })

        await this.helper.describe(`digita o nome ${newUser.firstname} ${newUser.lastname} e vai para o proximo step ...`, async () => {
            await page.waitForSelector("#firstname_input")
            await page.type("#firstname_input", newUser.firstname)
            await page.type("#lastname_input", newUser.lastname)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        let day = newUser.birth_day ? String(newUser.birth_day) : this.helper.random("day")
        let month = newUser.birth_month ? String(newUser.birth_month) : this.helper.random("month")
        let year = newUser.birth_year ? String(newUser.birth_year) : this.helper.random("year")
        await this.helper.describe(`define a data de nascimento ${day}/${month}/${year} e vai para o proximo step ...`, async () => {
            await page.waitForSelector("select[data-sigil='birthday_day']")
            await page.select("select[data-sigil='birthday_day']", day)
            await page.select("select[data-sigil='birthday_month']", month)
            await page.select("select[data-sigil='birthday_year']", year)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })


        await this.helper.describe(`seleciona que vai cadastrar por email ...`, async () => {
            await page.waitForSelector("a[data-sigil='switch_phone_to_email']")
            await page.click("a[data-sigil='switch_phone_to_email']")
            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        await this.helper.describe(`digita o email ${newUser.email} ...`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            await page.type("input[name='reg_email__']", newUser.email)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        let sex = newUser.sex ? (newUser.sex.toLowerCase() == "f" ? 2 : 1) : this.helper.random("sex")
        let sexs = ["", "Maculino", "Feminino"]
        await this.helper.describe(`seleciona o sexo ${sexs[sex]} ...`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            page.$eval("input[name='sex'][data-value='" + sex + "']", elem => elem.click())
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        let password = newUser.password ? newUser.password : this.helper.random("password")
        await this.helper.describe(`define a senha ${password} ...`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            await page.type("input[name='reg_passwd__']", password)
            await page.click("button[data-sigil='touchable multi_step_submit']")
            await page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        await this.helper.describe(`conta criada ...`, async () => {
            await this.browser.close()
        })

    }
}

module.exports = facebook