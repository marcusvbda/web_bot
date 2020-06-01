String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

const Helper = {
    async describe(description, command) {
        if (process.env.SHOW_DESCRIPTION.toLowerCase() == 'true') console.log(description)
        await command()
    },
    random(type) {
        switch (type) {
            case "sex":
                return String(Math.floor(Math.random() * (+2 - +1) + +1))
            case "day":
                return String(Math.floor(Math.random() * (+28 - +1) + +1))
            case "password":
                let c = Date.now() / 500
                let d = c.toString(16).split(".").join("")
                while (d.length < 14) d += "0"
                let e = ""
                let a = ""
                return `#${(a + d + e).capitalize()}!`
            case "month":
                return String(Math.floor(Math.random() * (+12 - +1) + +1))
            case "year":
                return String(Math.floor(Math.random() * (+1980 - +1992) + +1992))
            default:
                return null
        }
    }
}
module.exports = Helper