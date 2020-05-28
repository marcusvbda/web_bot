
(async () => {
    require('dotenv').config()
    const facebook = require("./src/facebook")

    await facebook.signup({
        email: "email@teste.com",
        firstname: "Jõao",
        lastname: "da Silva",
        sex: "m", //m or f 
        birthday_day: 08, //optional
        birthday_month: 04,  //optional
        birthday_year: 1992, //optional
        password: "S3nh4DoF4cebo0k" //optional
    })

})()