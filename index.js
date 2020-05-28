
(async () => {
    require('dotenv').config()
    const facebook = require("./src/facebook")

    await facebook.signup({
        email: "email@teste.com",
        firstname: "João",
        lastname: "da Silva",
        sex: "m", //m or f 
        birthday_day: 08, //optional
        birthday_month: 08,  //optional
        birthday_year: 1988, //optional
        password: "S3nh4DoF4cebo0k" //optional
    })

    // await facebook.login("user_email", "******")
    // await facebook.likeAllPosts()

})()