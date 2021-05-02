/**
 * This is our helper to make the API call to the emotional analysis server. Notice that the entry string is truncated to 1900 character. 
 * At the moment there machine learning model truncates text at 2000 characters. 
 * 
 * You will need an API key from RapidAPI to play with this particular API 
 */

var axios = require('axios');
require('dotenv').config()


async function symantoCall(entry) {

    // const API_KEY = process.env.API_KEY;
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
    
    const truncatedEntry = entry.substring(0, 1900);

    let entryData = JSON.stringify([{
        text: truncatedEntry,
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
