const { _ENTER_ } = require("./core/keys")
const { describe, random } = require("./core/helper")
const browser = require("./core/browser")
const readline = require('readline-sync')
const faker = require("./core/faker")

const outlook = {
    newUser: {},
    async makeNewUser() {
        let fakeUser = await faker.getFakeRandomUser()
        if (!fakeUser) throw ("Não foi possivel criar usuario fake")
        this.newUser = {
            email: `${fakeUser.login.username}@hotmail.com`,
            firstname: fakeUser.name.first,
            lastname: fakeUser.name.last,
            birthday_day: random("day"),
            birthday_month: random("month"),
            birthday_year: random("year"),
            password: random("password"),
        }
    },
    async createFakeUser() {
        await this.makeNewUser()
        console.log(this.newUser)
        await browser.createPage()
        await describe(`acessa o outlook e preenche formulário ...`, async () => {
            await browser.goto('https://signup.live.com/signup')
        })

        await describe("seleciona que deseja criar novo email e preenche formulário ...", async () => {
            await browser.waitFor("#MemberName")
            await browser.type("#MemberName", this.newUser.email)
            await browser.click("#iSignupAction")
        })

        await describe("define a senha e desmarca que deseja receber informações ...", async () => {
            await browser.waitFor("#PasswordInput")
            await browser.type("#PasswordInput", this.newUser.password)
            await browser.click("#iOptinEmail")
            await browser.click("#iSignupAction")
        })

        await describe("preenche nome e sobrenome ...", async () => {
            await browser.waitFor("#FirstName")
            await browser.type("#FirstName", this.newUser.firstname)
            await browser.type("#LastName", this.newUser.lastname)
            await browser.click("#iSignupAction")
        })

        await describe("seleciona região e define aniversário ...", async () => {
            await browser.waitFor("#Country")
            await browser.select("#Country", "BR")
            await browser.select("#BirthDay", String(this.newUser.birthday_day))
            await browser.select("#BirthMonth", String(this.newUser.birthday_month))
            await browser.select("#BirthYear", String(this.newUser.birthday_year))

            await browser.click("#iSignupAction")
        })

        // await describe("aguarda solução de captcha ...", async () => {
        //     let captcha = await this.solvedCaptcha("img[aria-label='Desafio visual']")
        //     await browser.type("input", captcha.replace(/\s/g, '').toLocaleUpperCase())
        //     // await browser.click("#iSignupAction")
        // })
    },
    async solvedCaptcha(element) {
        await browser.waitFor(element)
        let captcha_url = await browser.executeScript(({ element }) => document.querySelector("img[aria-label='Desafio visual']").src, { element })
        console.log(`\n\n${captcha_url}\n`)
        let captcha_value = readline.question(` >> Digite o valor do captcha acima : `)
        return captcha_value
    }
}
module.exports = outlook