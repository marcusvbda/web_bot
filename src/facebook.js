const facebook = {
    helper: require("./core/helper"),
    browser: require("./core/browser"),
    page: undefined,
    async createPage() {
        this.page = await this.browser.createPage()
    },
    async signup(newUser) {
        await this.createPage()

        await this.helper.describe("acessa o facebook e seta o window.navigator = undefined ...", async () => {
            await this.page.goto('https:/facebook.com/reg', {
                waitUntil: 'networkidle2'
            })
            await this.page.evaluateOnNewDocument(() => {
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
            await this.page.waitForSelector("input[name='firstname']")
            await this.page.type("input[name='firstname']", newUser.firstname)
            await this.page.type("input[name='lastname']", newUser.lastname)
            await this.page.type("input[name='reg_email__']", newUser.email)

            await this.page.waitForSelector("input[name='reg_email_confirmation__']")
            await this.page.type("input[name='reg_email_confirmation__']", newUser.email)
            await this.page.type("input[name='reg_passwd__']", newUser.password)

            await this.page.select("select[name='birthday_day']", newUser.birthday_day)
            await this.page.select("select[name='birthday_month']", newUser.birthday_month)
            await this.page.select("select[name='birthday_year']", newUser.birthday_year)

            await this.page.evaluate(({ newUser }) => {
                document.querySelector(`input[type='radio'][name='sex'][value='${newUser.sex}']`).click()
            }, { newUser })

            await this.page.type("input[name='firstname']", String.fromCharCode(13))

            await this.page.waitFor(parseInt(process.env.WAIT_TIMEOUT))
        })

        newUser.sex = newUser.sex == 1 ? "Feminino" : "Masculino"

        await this.helper.describe("conta criada ...", async () => {
            console.log(newUser)
            // await this.browser.close()
        })

    },
    async login(user, pass) {
        await this.createPage()

        await this.helper.describe("acessa o facebook ...", async () => {
            await this.page.goto('https://facebook.com/', {
                waitUntil: 'networkidle2'
            })
        })

        await this.helper.describe("preenche o formulário de login ...", async () => {
            await this.page.waitForSelector("input[name='email']")
            await this.page.type("input[name='email']", user)
            await this.page.type("input[name='pass']", pass)
            await this.page.type("input[name='pass']", String.fromCharCode(13))
            await this.page.waitForNavigation()
        })

        await this.helper.describe("muda pra versao mobile para melhor manipulação ...", async () => {
            await this.helper.describe("acessa o facebook ...", async () => {
                await this.page.goto('https://m.facebook.com/', {
                    waitUntil: 'networkidle2'
                })
            })
        })
    },
    async likeAllPosts(limit_scrolls = 5) {

        await this.helper.describe("curte todos os posts visíveis...", async () => {
            for (let i = 0;i < limit_scrolls;i++) {
                await this.page.evaluate(() => {
                    let posts = document.querySelectorAll("article._5rgr._5gh8.async_like ._52jj._15kl._3hwk._4g34 > .touchable:not(._77la)")
                    posts.forEach(post => post.click())
                    window.scrollBy(0, document.body.scrollHeight)
                })
                await this.page.waitFor(1000)
            }
        })

    }
}

module.exports = facebook