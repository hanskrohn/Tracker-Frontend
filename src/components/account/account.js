import React, {useState, useEffect} from 'react'
import { Button, Icon } from 'semantic-ui-react'
import history from '../../history'

const Account = (props) => {

  const [usernameErrors, setUsernameErrors] = useState([])
  const [usernameSuccess, setUsernameSuccess] = useState([])
  const [passwordErrors, setPasswordErrors] = useState([])
  const [passwordSuccess, setPasswordSuccess] = useState([])
  const [deletionErrors, setDeletionErrors] = useState([])
  const [username, setUsername] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/user/profile', {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.json())
    .then(res => {
      if(res.message === "Successful"){
        setUsername(res.username)
      }
      else if(res.message === "Internal Server Error"){
        alert('An Error has Occured. Please Try Again.')
      }
      else if(res.message === "Auth Failed"){
        history.push('/login')
      }
    })
    .catch(err => {
      alert('An Error Has Occured. Please Try Again.')
    })
  }, [])

  const handleUsername = (e) => {
  e.preventDefault()

  const username = e.target['username'].value.toString()

  e.target['username'].value = ''

  fetch('http://localhost:5000/api/user/updateUsername', {
    method: 'PATCH',
    credentials: 'include',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      username: username
    })})
    .then(res => res.json())
    .then(res => {
      if(res.message === "Internal Server Error"){
        setUsernameErrors([
          'Ensure Username is between 4-20 Characters.',
          'Ensure Username does not have Special Characters.'
        ])
        setUsernameSuccess([])
      }
      else if(res.message === "Username Exists"){
        setUsernameErrors(["Username Exists"])
        setUsernameSuccess([])
      }
      else if(res.message === "Auth Failed"){
        props.setLoggedIn('false')
        history.push('/login')
      }
      else{
        setUsername(username)
        setUsernameSuccess(['Username Updated'])
        setUsernameErrors([])
      }
    })
    .catch(err => {
      alert('An Error Has Occured. Please Try Again.')
    })
  }

  const handlePassword = (e) => {
    e.preventDefault()

    const currentPassword = e.target['currentPassword'].value.toString()
    const newPassword = e.target['newPassword'].value.toString()

    if(e.target['newPassword'].value !== e.target['reNewPassword'].value){
      setPasswordErrors(['Make Sure New Passwords Match'])
      setPasswordSuccess([])
    }
    else{
      e.target['currentPassword'].value = ''
      e.target['newPassword'].value = ''
      e.target['reNewPassword'].value = ''

      fetch('http://localhost:5000/api/user/updatePassword', {
        method: 'PATCH',
        credentials: 'include',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          newPassword: newPassword,
          password: currentPassword
        })})
        .then(res => res.json())
        .then(res => {
          if(res.message === "Password Match Previous Password"){
            setPasswordErrors(['Ensure New Password is not the same as Previous Password'])
            setPasswordSuccess([])
          }
          else if(res.message === "Please Check Password"){
            setPasswordErrors(['Ensure Current Password is Correct'])
            setPasswordSuccess([])
          }
          else if(res.message === "Internal Server Error"){
            setPasswordErrors(['Internal Server Error'])
            setPasswordSuccess([])
          }
          else if(res.message === "Auth Failed"){
            history.push('/login')
          }
          else{
            setPasswordSuccess(['Password Updated'])
            setPasswordErrors([])
          }
        })
        .catch(err => {
          alert('An Error Has Occured. Please Try Again.')
        })
    }
  }

  const handleDeletion = (e) => {
    e.preventDefault()

    const password =  e.target['password'].value.toString()

    fetch('http://localhost:5000/api/user/delete', {
      method: 'DELETE',
      credentials: 'include',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({
        password: password
    })})
    .then(res => res.json())
    .then(res => {
      if(res.message === "Check Password"){
        setDeletionErrors(['Ensure Current Password is Correct'])
      }
      else if(res.message === "Auth Failed"){
        history.push('/login')
      }
      else if(res.message === "Internal Server Error"){
        setDeletionErrors(['Internal Server Error'])
      }
      else{
        setDeletionErrors([])
        history.push('/signup')
      }
    })
    .catch(err => {
      alert('An Error Has Occured. Please Try Again.')
    })
  }

  return(
    <div className = "height100vh flex flexJustifyContentCenter backgroundColorGradiantGreen">
      <div className = "contentDiv height100vh">
        <div className = "accountCard">
          <h2 className = "paddingLeft5percent colorWhite">Username</h2>
          <hr className = "margin0auto"></hr>
          <form className = "textAlignCenter" onSubmit = {handleUsername}>
            {
              usernameErrors.length !== 0
              ?
                <div className = "paddingTopBottom20px">
                  <div className = "errorBox textAlignCenter">
                    <h3>Errors</h3>
                      <ul className = "popUpUL">
                        {usernameErrors.map((err, index) => {
                          return <li key = {index} className = "errorText">{err}</li>
                        })}
                      </ul>
                  </div>
                </div>
              :
              null
            }
            {
              usernameSuccess.length !== 0
              ?
                <div className = "paddingTopBottom20px">
                  <div className = "successBox textAlignCenter">
                    <h3>Success</h3>
                      <ul className = "popUpUL">
                        {usernameSuccess.map((err, index) => {
                          return <li key = {index} className = "successText">{err}</li>
                        })}
                      </ul>
                  </div>
                </div>
              :
              null
            }
            <div className = "marginTopBottom50px">
              <input className = "inputStyle colorWhite" type="text" placeholder={username} required="required" name = "username" />
            </div>
            <div>
              <Button className = "width80percent marginBottom50px loginPageButtonColor colorWhite" animated>
                <Button.Content className = "slowerTransition" visible>Update</Button.Content>
                <Button.Content className = "slowerTransition" hidden>
                  <Icon name='user' />
                </Button.Content>
              </Button>
            </div>
          </form>
        </div>
        <div className = "accountCard">
          <h2 className = "paddingLeft5percent colorWhite">Change Password</h2>
          <hr className = "margin0auto"></hr>
          <form className = "textAlignCenter" onSubmit = {handlePassword}>
            {
              passwordErrors.length !== 0
              ?
                <div className = "paddingTopBottom20px">
                  <div className = "errorBox textAlignCenter">
                    <h3>Errors</h3>
                      <ul className = "popUpUL">
                        {passwordErrors.map((err, index) => {
                          return <li key = {index} className = "errorText">{err}</li>
                        })}
                      </ul>
                  </div>
                </div>
              :
              null
            }
            {
              passwordSuccess.length !== 0
              ?
                <div className = "paddingTopBottom20px">
                  <div className = "successBox textAlignCenter">
                    <h3>Success</h3>
                      <ul className = "popUpUL">
                        {passwordSuccess.map((err, index) => {
                          return <li key = {index} className = "successText">{err}</li>
                        })}
                      </ul>
                  </div>
                </div>
              :
              null
            }
            <div className = "marginTopBottom50px">
              <input className = "inputStyle colorWhite" type="password" placeholder="Current Password" required="required" name = "currentPassword" />
            </div>
            <div className = "marginTopBottom50px">
              <input className = "inputStyle colorWhite" type="password" placeholder="New Password" required="required" name = "newPassword" />
            </div>
            <div className = "marginTopBottom50px">
              <input className = "inputStyle colorWhite" type="password" placeholder="Re-Enter New Password" required="required" name = "reNewPassword" />
            </div>
            <div>
              <Button className = "width80percent marginBottom50px loginPageButtonColor colorWhite" animated>
                <Button.Content className = "slowerTransition" visible>Update</Button.Content>
                <Button.Content className = "slowerTransition" hidden>
                  <Icon name='user' />
                </Button.Content>
              </Button>
            </div>
          </form>
        </div>
        <div className = "accountCard">
          <h2 className = "paddingLeft5percent colorWhite">Delete Account</h2>
          <hr className = "margin0auto"></hr>
          <form className = "textAlignCenter" onSubmit = {handleDeletion}>
            {
              deletionErrors.length !== 0
              ?
                <div>
                  <div className = "errorBox center">
                    <h3>Errors</h3>
                      <ul>
                        {deletionErrors.map((err, index) => {
                          return <li key = {index} className = "liText">{err}</li>
                        })}
                      </ul>
                  </div>
                </div>
              :
              null
            }
            <div className = "marginTopBottom50px">
              <input className = "inputStyle colorWhite" type="password" placeholder="Password" required="required" name = "password" />
            </div>
            <div>
              <Button className = "width80percent marginBottom50px loginPageButtonColor colorWhite" animated>
                <Button.Content className = "slowerTransition" visible>Delete Account</Button.Content>
                <Button.Content className = "slowerTransition" hidden>
                  <Icon name='trash alternate' />
                </Button.Content>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Account
