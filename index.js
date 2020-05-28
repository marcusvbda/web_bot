(async () => {
    const newUser = {
        firstname: "Joao",
        lastname: "da Silva Sauro",
        email: "********"
    }

    const Browser = require("./browser")
    const Helper = require("./helper")

    const signup = async () => {
        const page = await Browser.createPage()

        await Helper.describe("acessa o facebook e seta o window.navigator = {} ...", async () => {
            await page.goto('https://m.facebook.com/reg', {
                waitUntil: 'networkidle2'
            })
            await page.evaluate(() => {
                window.navigator = {}
            })
        })

        await Helper.describe(`digita o nome ${newUser.firstname} ${newUser.lastname} e vai para o proximo step ...`, async () => {
            await page.waitForSelector("#firstname_input")
            await page.type("#firstname_input", newUser.firstname)
            await page.type("#lastname_input", newUser.lastname)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(500)
        })

        let day = Helper.random("day")
        let month = Helper.random("month")
        let year = Helper.random("year")
        await Helper.describe(`define a data de nascimento ${day}/${month}/${year} e vai para o proximo step ...`, async () => {
            await page.waitForSelector("select[data-sigil='birthday_day']")
            await page.select("select[data-sigil='birthday_day']", day)
            await page.select("select[data-sigil='birthday_month']", month)
            await page.select("select[data-sigil='birthday_year']", year)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(500)
        })

        await Helper.describe(`seleciona que vai cadastrar por email ...`, async () => {
            await page.waitForSelector("a[data-sigil='switch_phone_to_email']")
            await page.click("a[data-sigil='switch_phone_to_email']")
            await page.waitFor(500)
        })

        await Helper.describe(`digita o email ${newUser.email} ...`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            await page.type("input[name='reg_email__']", newUser.email)
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(500)
        })

        let sex = Helper.random("sex")
        let sexs = ["", "Maculino", "Feminino"]
        await Helper.describe(`seleciona o sexo ${sexs[sex]} ...`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            page.$eval("input[name='sex'][data-value='" + sex + "']", elem => elem.click())
            await page.click("button[data-sigil='touchable multi_step_next']")
            await page.waitFor(500)
        })

        let password = Helper.random("password")
        await Helper.describe(`define a senha ${password} ...`, async () => {
            await page.waitForSelector("input[name='reg_email__']")
            await page.type("input[name='reg_passwd__']", password)
            await page.click("button[data-sigil='touchable multi_step_submit']")
            await page.waitFor(500)
        })

        console.log("Conta criada...")
        await Browser.close()
    }

    await signup()


})()