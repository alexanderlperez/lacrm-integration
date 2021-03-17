import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled' 
import { useForm } from 'react-hook-form'
import superagent from 'superagent'

// import firebase from 'firebase/app'
// import 'firebase/auth'
// import firebaseConfig from './firebaseConfig.js'
// import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
// 
// firebase.initializeApp(firebaseConfig);

const CF_URL = "https://us-central1-lacrm-integration.cloudfunctions.net/createNote"
//const CF_URL = "http://127.0.0.1:5001/lacrm-integration/us-central1/createNote"

const LACRMForm = styled('form')`
  & > * {
      display: block;
  }

  textarea, input, select {
    margin-left: 1em;
  }
`

const NoteForm = ({setRoute}) => {
  const {register, handleSubmit, errors } = useForm();
  const [hasError, setHasError] = useState(false)

  const onSubmit = data => {
    const out = superagent
      .get(CF_URL)
      .query({ 
        ...data,
      })
      .catch(() => {
        setHasError(true)
      })
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
    display: ${props => props.isVisible ? 'block' : 'none'};
    color: red;
  `

  return (
    <LACRMForm onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="churchMember">
        Church Member: 
        <select id="churchMember" name="churchMember" ref={register} required="true">
          <option value="">Select a church member</option>
          <option value="3726268736538631475369381625468">Alex Perez</option>
        </select>
      </label>
      <label htmlFor="email">
        Your Email: 
        <input type="text" id="email" ref={register} name="email" required="true"/>
      </label>
      <label htmlFor="note">
        Note:
        <textarea id="name" name="note" ref={register} required="true"></textarea>
      </label>
      <button type="submit" name="submit" ref={register}>Submit</button>
      <ErrorMsg isVisible={hasError}>There was an error submitting your note! Please check that your email is correct and try again</ErrorMsg>
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
