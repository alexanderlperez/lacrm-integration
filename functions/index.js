const superagent = require('superagent')
const functions = require("firebase-functions");
const admin = require('firebase-admin')
admin.initializeApp()

const express = require('express');
const cookieParser = require('cookie-parser')();
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});
const app = express();

const { format } = require('date-fns')

const API_URL = 'https://api.lessannoyingcrm.com/'

const USER_CODE = '95E24'
const API_KEY = '613924-AgfdG3fCxn2wJpsHJNIbmQqMGBMkKEp2OYZSAISsRG3zvxwj0X' 

/* Local test data
const USER_CODE = 'A0DC5'
const API_KEY = '658885-AcIrvp5jbzw7qhfGvWGzfbZqEPZCmkHzUrc5G2fBOwVXnrJMSE' 
const DUMMY_CONTACT_ID = '3721904669969614100048897386911' // Test Contact
*/

const callAPI = async (func, params) => {
  let body = {
    UserCode: USER_CODE,
    APIToken: API_KEY,
    Function: func,
  }

  const out = API_URL + '?' + new URLSearchParams(body).toString() + '&Parameters=' + JSON.stringify(params)
  return superagent.post(out).then(res => res.body)
}

app.use(cors);
app.use(bodyParser.json());
app.get('/', async (req, res) => {
  const emails = [
    'laperez@cfl.rr.com'
  ]

  console.log(req.query)

  if (!emails.find(e => e === req.query.email)) {
    console.log(emails, req.query.email)
    console.log('could not find email!')
    res.json({Success: false})
    return 
  }

  console.log('found email!')

  const { email, note, churchMember } = req.query

  const out = await callAPI('CreateNote', {
    ContactId: churchMember,
    Note: 
    `From ${email} on ${format(new Date(), 'L/d/yyyy h:mmaaa')}:
${note}
`
  })

  res.json(out)
});

exports.createNote = functions.https.onRequest(app)
