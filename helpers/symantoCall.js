var axios = require('axios');
require('dotenv').config()


async function symantoCall(entry) {

    // const API_KEY = process.env.API_KEY;
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    
    let entryData = JSON.stringify([{
        text: entry,
        language:"en"

    }])
    

    let config = {
        method: 'post',
        url: 'https://ekman-emotion-analysis.p.rapidapi.com/ekman-emotion?all=true',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'ekman-emotion-analysis.p.rapidapi.com'
        },
        data: entryData
      };

      let res = await axios(config)
      
    console.log(res.data)
    return res.data

}




module.exports = symantoCall;
