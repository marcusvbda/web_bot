const facebook = {
    helper: require("./core/helper"),
    browser: require("./core/browser"),
    driver: undefined,
    async createPage() {
        this.driver = await this.browser.createPage()
    },
    async signup(newUser) {
        await this.createPage()
        await this.helper.describe("acessa o facebook ...", async () => {
            await this.driver.browser.get('https:/facebook.com/reg')
            await this.driver.browser.executeScript(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => undefined,
                })
            })
        })

        newUser.password = newUser.password ? newUser.password : this.helper.random("password")
        newUser.birthday_day = newUser.birthday_day ? String(newUser.birthday_day) : this.helper.random("day")
        newUser.birthday_month = newUser.birthday_month ? String(newUser.birthday_month) : this.helper.random("month")
        newUser.birthday_year = newUser.birthday_year ? String(newUser.birthday_year) : this.helper.random("year")
        newUser.sex = newUser.sex ? (newUser.sex.toLowerCase() == "f" ? 2 : 1) : this.helper.random("sex")

        await this.helper.describe("preenche o formulário de cadastro ...", async () => {
            await this.driver.browser.findElement({ xpath: "//input[@name='firstname']" }).sendKeys(newUser.firstname)
            await this.driver.browser.findElement({ xpath: "//input[@name='lastname']" }).sendKeys(newUser.lastname)
            await this.driver.browser.findElement({ xpath: "//input[@name='reg_email__']" }).sendKeys(newUser.email)
            await this.driver.browser.findElement({ xpath: "//input[@name='reg_email_confirmation__']" }).sendKeys(newUser.email)
            await this.driver.browser.findElement({ xpath: "//input[@name='reg_passwd__']" }).sendKeys(newUser.password)
            await this.driver.browser.executeScript(({ newUser }) => {
                document.querySelector("select[name='birthday_day']").value = newUser.birthday_day
                document.querySelector("select[name='birthday_month']").value = newUser.birthday_month
                document.querySelector("select[name='birthday_year']").value = newUser.birthday_year
            }, { newUser })
            await this.driver.browser.executeScript(({ newUser }) => {
                document.querySelector(`input[type='radio'][name='sex'][value='${newUser.sex}']`).click()
            }, { newUser })
            await this.driver.browser.findElement({ xpath: "//input[@name='firstname']" }).sendKeys(this.driver.keys.ENTER)
        })

        newUser.sex = newUser.sex == 1 ? "Feminino" : "Masculino"

        await this.helper.describe("conta criada ...", async () => {
            console.log(newUser)
            // await this.browser.close()
        })

    },
}

module.exports = facebook