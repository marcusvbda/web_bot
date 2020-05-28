
(async () => {
    require('dotenv').config()
    const facebook = require("./src/facebook")

    await facebook.signup({
        email: "email@teste.com",
        firstname: "João",
        lastname: "da Silva",
        sex: "m", //m or f 
        birthday_day: 08, //optional
        birthday_month: 04,  //optional
        birthday_year: 1992, //optional
        password: "S3nh4doF4cebo0k!" //optional
    })

})()