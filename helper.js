class Helper {

    async describe(description, command) {
        console.log(description)
        await command()
    }

    random(type) {
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
}
module.exports = new Helper()