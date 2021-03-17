const superagent = require('superagent')
const functions = require("firebase-functions");
const admin = require('firebase-admin')
admin.initializeApp()

const USER_CODE = 'A0DC5'
const API_KEY = '658885-AcIrvp5jbzw7qhfGvWGzfbZqEPZCmkHzUrc5G2fBOwVXnrJMSE' 
const API_URL = 'https://api.lessannoyingcrm.com/'
const DUMMY_CONTACT_ID = '3721904669969614100048897386911' // Test Contact

const callAPI = async (func, params) => {
  let body = {
    UserCode: USER_CODE,
    APIToken: API_KEY,
    Function: func,
  }

  const out = API_URL + '?' + new URLSearchParams(body).toString() + '&Parameters=' + JSON.stringify(params)
  superagent.post(out).then(res => console.log(res.body))
  return


  return res.text()
}

exports.test = functions.https.onRequest(async (req, res) => {
  const out = await callAPI('CreateNote', {
    'ContactId': DUMMY_CONTACT_ID,
    'Note': `Testing ${new Date().toString()}`
  })

  res.json({result: out})
})
