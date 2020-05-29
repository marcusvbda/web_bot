const { _ENTER_ } = require("./core/keys")
const { describe, random } = require("./core/helper")
const browser = require("./core/browser")

const facebook = {

    async signup(newUser) {
        await browser.createPage()
        await describe(`Acessa o facebook ...`, async () => {
            await browser.goto('https://facebook.com/reg')
        })

        newUser.password = newUser.password ? newUser.password : random("password")
        newUser.birthday_day = newUser.birthday_day ? String(newUser.birthday_day) : random("day")
        newUser.birthday_month = newUser.birthday_month ? String(newUser.birthday_month) : random("month")
        newUser.birthday_year = newUser.birthday_year ? String(newUser.birthday_year) : random("year")
        newUser.sex = newUser.sex ? (newUser.sex.toLowerCase() == "m" ? 2 : 1) : random("sex")

        await describe("preenche o formulário de cadastro ...", async () => {
            await browser.waitFor("input[name='firstname']")
            await browser.type("input[name='firstname']", newUser.firstname)
            await browser.type("input[name='lastname']", newUser.lastname)
            await browser.type("input[name='reg_email__']", newUser.email)
            await browser.type("input[name='reg_email_confirmation__']", newUser.email)
            await browser.type("input[name='reg_passwd__']", newUser.password)
            await browser.select("select[name='birthday_day']", newUser.birthday_day)
            await browser.select("select[name='birthday_month']", newUser.birthday_month)
            await browser.select("select[name='birthday_year']", newUser.birthday_year)
            await browser.radio("input[type='radio'][name='sex']", newUser.sex)
        })

        await describe("submite as informações ...", async () => {
            await browser.type("input[name='firstname']", _ENTER_)
        })

        //await browser.close()
    }
}

module.exports = facebook