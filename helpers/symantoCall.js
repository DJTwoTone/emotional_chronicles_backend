var axios = require('axios');
require('dotenv').config()


async function symantoCall(entry) {

    const data = JSON.stringify([{
        "text": entry,
        "language":"en"
    }])


    
    const API_KEY = process.env.API_KEY;

    const config = {
        method: 'post',
        url: 'https://api.symanto.net/ekman-emotion?all=true',
        headers: {
            'x-api-key': API_KEY, 
            'Content-Type': 'application/json'
        },
        data
    }

    

    let res = await axios(config)
    
    return res.data

}

module.exports = symantoCall;
