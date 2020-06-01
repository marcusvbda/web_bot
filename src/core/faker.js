const axios = require('axios')

const fake = {
    async getFakeRandomUser(callback) {
        let response = await axios.get('https://randomuser.me/api/')
        return response.data ? response.data.results[0] : null
    }
}

module.exports = fake