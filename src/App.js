import React, {useState, useEffect} from 'react'
import styled from '@emotion/styled' 
import { useForm } from 'react-hook-form'


import firebase from 'firebase/app'
import 'firebase/auth'
import firebaseConfig from './firebaseConfig.js'
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

firebase.initializeApp(firebaseConfig);

const LACRMForm = styled('form')`
  & > * {
      display: block;
  }
`

const NoteForm = () => {
  const {register, handleSubmit, errors } = useForm();
  const onSubmit = data => console.log(data)

  return (
    <LACRMForm onSubmit={handleSubmit(onSubmit)}>
      <select id="team-members" name="team-members" ref={register}>
        <option value="">asdfasdfasdfasdf</option>
      </select>
      <textarea id="name" name="note" ref={register}></textarea>
      <button type="submit" ref={register}>Submit</button>
    </LACRMForm>
  )
}

const Login = () => {
  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ]
  }

  return (
    <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  )
}

const Complete = () => {}

export const App = () => {
  const [route, setRoute] = useState('login')

  const routes = {
    form: <NoteForm />,
    login: <Login />,
    complete: <Complete />,
  }

  return routes[route]
}
