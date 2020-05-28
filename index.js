
(async () => {
    require('dotenv').config()
    const facebook = require("./src/facebook")

    await facebook.signup({
        email: "email@teste.com",
        firstname: "Jõao",
        lastname: "da Silva",
        sex: "m", //m or f 
        birth_day: 08, //optional
        birth_month: 04,  //optional
        birth_month: 1992, //optional
        password: "*******" //optional
    })

})()