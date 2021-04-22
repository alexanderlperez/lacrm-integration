const { utcToZonedTime, format } = require('date-fns-tz')
const superagent = require('superagent')
const functions = require("firebase-functions");
const admin = require('firebase-admin')
admin.initializeApp()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')({origin: true});
const app = express();

const API_URL = 'https://api.lessannoyingcrm.com/'

// TODO: put these values in a .env file and make them switchable at deploy time

// Production 
const USER_CODE = '95E24'
const API_KEY = '613924-AgfdG3fCxn2wJpsHJNIbmQqMGBMkKEp2OYZSAISsRG3zvxwj0X' 

const callAPI = async (func, params) => {
  let body = {
    UserCode: USER_CODE,
    APIToken: API_KEY,
    Function: func,
    Parameters: JSON.stringify(params)
  }

  console.log('sending data\n', body)

  return superagent.post(API_URL)
    .type('form')
    .send(body)
    .catch(e => console.log('got error:', e))
    .then(res => res.body)
}

app.use(cors);
app.use(bodyParser.json());

app.get('/createNote', async (req, res) => {
  const { note, churchMember, teamMember } = req.query
  const out = await callAPI('CreateNote', {
    ContactId: churchMember,
    Note: 
    `From ${teamMember} on ${format(utcToZonedTime(new Date(), 'America/New_York'), 'L/d/yyyy h:mmaaa')}:
${note}
`
  })

  res.json(out)
});

app.get('/allContacts', async (_, res) => {
  let page = 1;
  let results = [];

  while (true) {
    const out = await callAPI(
      'SearchContacts', 
      {
        SearchTerms: '',
        NumRows: 500,
        Sort: 'FirstName',
        Page: page,
      }
    )

    if (out.Result.length < 1) {
      break;
    }

    results.push(out.Result)

    page++;
  }

  res.json(
    results
      .flat()
      .map(({ContactId, FirstName, LastName, Salutation, Suffix}) => ({ContactId, FirstName, LastName, Salutation, Suffix}))
  )
})

/**
 * Same as allContacts. Created just to get Pastoral_Care_Team group members.
 */
app.get('/careTeamContacts', async (_, res) => {
  let page = 1;
  let results = [];

  while (true) {
    const out = await callAPI(
      'SearchContacts', 
      {
        SearchTerms: 'Group:Pastoral_Care_Team',
        NumRows: 500,
        Sort: 'FirstName',
        Page: page,
      }
    )

    if (out.Result.length < 1) {
      break;
    }

    results.push(out.Result)

    page++;
  }

  res.json(
    results
      .flat()
      .map(({ContactId, FirstName, LastName, Salutation, Suffix}) => ({ContactId, FirstName, LastName, Salutation, Suffix}))
  )
})

exports.api = functions.https.onRequest(app)
