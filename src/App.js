import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled' 
import { useForm } from 'react-hook-form'
import superagent from 'superagent'

// const CF_URL = "https://us-central1-lacrm-integration.cloudfunctions.net/api"
const CF_URL = "http://127.0.0.1:5001/lacrm-integration/us-central1/api"

const LACRMForm = styled('form')`
  width: 550px; 
  display: flex;
  flex-direction: column;

  & > * {
      display: block;
  }

  .item {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  textarea, input, select {
    box-sizing: border-box;
    width: 300px;
  }

  .submit {
    margin-top: 10px;
    width: 90px;
    height: 30px;
    align-self: flex-end;
  }

  #note {
    height: 100px;
  }
`

const maybeEmpty = (str, last) => 
  str 
    ? str + (last ? '' : ' ') 
    : ''

const NoteForm = ({setRoute}) => {
  const {register, handleSubmit } = useForm();
  const [hasError, setHasError] = useState(false)
  const [churchMembers, setChurchMembers] = useState([])
  const [careTeamMembers, setCareTeamMembers] = useState([])

  // console.log(churchMembers)

  useEffect(() => {
    superagent
      .get(CF_URL + '/allContacts')
      .catch(() => setHasError(true))
      .then(res => setChurchMembers(res.body))

    superagent
      .get(CF_URL + '/careTeamContacts')
      .catch(() => setHasError(true))
      .then(res => setCareTeamMembers(res.body))
  }, [])

  const onSubmit = data => {
    superagent
      .get(CF_URL + '/createNote')
      .query({ ...data })
      .catch(() => setHasError(true))
      .then(res => {
        const { Success: success } = JSON.parse(res.text)
        console.log(res, success)

        if (!success) {
          setHasError(true)
          return 
        }

        setHasError(false)
        setRoute('complete')
      })
  }

  const ErrorMsg = styled.div`
    margin-top: 10px;
    display: ${props => props.isVisible ? 'block' : 'none'};
    color: red;
  `

  return (
    <LACRMForm onSubmit={handleSubmit(onSubmit)}>
      <div className="item">
        <label htmlFor="churchMember">For Church Member:</label>
        <select id="churchMember" name="churchMember" ref={register} required="true">
          {/* TODO: Will be populated with members from API */}
          <option value="">Select a church member</option>
          {churchMembers.length && churchMembers.map(m => (
            <option value={m.ContactId}>{[m.Salutation, m.FirstName, m.LastName, m.Suffix].map((str, i, a) => maybeEmpty(str, i === a.length - 1))}</option>
          ))}
        </select>
      </div>

      <div className="item">
        <label htmlFor="teamMember">From Pastoral Care Team Member:</label>
        <select id="teamMember" name="teamMember" ref={register} required="true">
          {/* TODO: Will be populated with members from API */}
          <option value="">Select a team member</option>
          {careTeamMembers.length && careTeamMembers.map(m => {
              const fullName = m => [m.Salutation, m.FirstName, m.LastName, m.Suffix].map((str, i, a) => maybeEmpty(str, i === a.length - 1))
              return <option value={fullName(m).join('')}>{fullName(m)}</option>
          })}
        </select>
      </div>

      <div className="item">
        <label htmlFor="note">Note:</label>
        <textarea id="note" name="note" ref={register} required="true"></textarea>
      </div>

      <button className="submit" type="submit" name="submit" ref={register}>Submit</button>
      <ErrorMsg isVisible={hasError}>There was an error. Please make sure you're online, refresh the page, and try again.</ErrorMsg>
    </LACRMForm>
  )
}

const Complete = ({setRoute}) => {
  const handleCreateAnother = () => {
    setRoute('form')
  }

  return (
    <div>
      Your message was sent.
      <br />
      <button onClick={handleCreateAnother}>Click here to create another note</button>
    </div>
  )
}

export const App = () => {
  const [route, setRoute] = useState('form')

  const routes = {
    form: <NoteForm setRoute={setRoute} />,
    complete: <Complete  setRoute={setRoute} />,
  }

  return routes[route]
}
