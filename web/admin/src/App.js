import React, { Component } from 'react'
import './App.css'
import client from '@doubledutch/admin-client'
import CustomMessages from './CustomMessages'
import List from './List'
import CustomModal from './Modal'
import FirebaseConnector from '@doubledutch/firebase-connector'
import { CSVLink } from 'react-csv';
const fbc = FirebaseConnector(client, 'safeapp')
fbc.initializeAppWithSimpleBackend()

export default class App extends Component {
  constructor() {
    super()
    this.state = { 
      showButtons: null,
      status: [], 
      check: null, 
      safeUsers: [],
      ooaUsers: [],
      allUsers: [],
      openVar: false,
      modalAlert: false,
      endCheck: false,
      modalMessage: ""
     }
    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount() {

    this.signin.then(() => {
      client.getUsers().then(users => {
        this.setState({allUsers: users.sort(sortUsers)})
        const checkRef = fbc.database.public.adminRef("check")
        const adminableRef = fbc.database.private.adminableUsersRef()
      
        checkRef.on('value', data => {
          const check = data.val() || false
          this.setState({ check, showButtons: true, endCheck: false, openVar: false})
        })

        adminableRef.on('child_added', data => {
          var newUser = users.find(newUser => newUser.id === data.key)
          if (newUser){
            if (data.val().status === "safe"){
              newUser.status = "Safe"
              var safeUsers = this.state.safeUsers.concat(newUser)
              safeUsers.sort(sortUsers)
              this.setState({ safeUsers })
            }
            if (data.val().status === "OOA"){
              newUser.status = "Out of Area"
              var ooaUsers = this.state.ooaUsers.concat(newUser)
              ooaUsers.sort(sortUsers)
              this.setState({ ooaUsers })
            }
          }      
        })

        adminableRef.on('value', data => {
          if (data.val() == null) {
            this.setState({ooaUsers: [], safeUsers: [], showButtons: true})
          }
        })
      })
    })
    .catch(err => alert(err))
  }

  render() {
    return (
      <div className="App">
        <CustomModal
        openVar = {this.state.openVar}
        closeModal = {this.closeModal}
        startCheck = {this.startCheck}
        endCheck = {this.state.endCheck}
        active = {this.state.showButtons}
        allUsers = {this.state.allUsers}
        modalMessage = {this.state.modalMessage}
        modalAlert = {this.state.modalAlert}
        />
        <div className="topBox">
          <p className='bigBoxTitle'>{'Safety Check'}</p>
          {this.showActivate()}
          {this.showCSV()}
        </div>
        <CustomMessages
        active = {this.state.check}
        sendPush = {this.sendPushMessage}
        sendPost = {this.sendPromotedMessage}
        testMessage = "There has been an incident in the area. Please mark yourself as safe."
        />
        {this.showActiveCheck()}
      </div>
    )
  }

  sendPushMessage = (pushMessage) => {
    var message = pushMessage.trim()
    if (message){
      client.cmsRequest('POST', '/api/messages', {
        Type: 'Push',
        Text: pushMessage,
        Schedule: {
          Now: true,
          TimeZoneId: 7
        },
        UserGroups: [],
        LinkTypeId: 3,
        LinkText: 'I Am Safe',
        LinkValue: getExtensionUrl()
      }).then(() => {
        this.setState({openVar: true, modalAlert: true, modalMessage: "Push Notification sent.", endCheck: false})
      })
      .catch(error => {alert("Please retry sending a Push Notification")})
    }
    else {
      alert("Please enter text to send a Push Notification")
    }

  }

  sendPromotedMessage = (promotedMessage) => {
    var message = promotedMessage.trim()
    if (message){
      client.cmsRequest('POST', '/api/messages', {
        Type: 'Promoted',
        Text: promotedMessage,
        Schedule: {
          Now: true,
          DurationInMinutes: 20
        },
        LinkTypeId: 3,
        LinkText: 'I Am Safe',
        LinkValue: getExtensionUrl()
      }).then(() => {
        this.setState({openVar: true, modalAlert: true, modalMessage: "Promoted Post created.", endCheck: false})
      })
      .catch(error => {alert("Please retry posting a Promoted Post")})
    }
    else {
      alert("Please enter text to post a Promoted Post")
    }
  }

  showActiveCheck = () => {
    if (this.isActive()) {
      return (    
        <div className="statusesBox">
          <List
          listData = {this.unknownUsers()}
          listName = {"Not Checked In"}
          /> 
          <List
          listData = {this.state.safeUsers}
          listName = {"Marked As Safe"}
          />
          <List
          listData = {this.state.ooaUsers}
          listName = {"Not in Area"}
          />
        </div>
      )
    }
  }

  unknownUsers = () => this.state.allUsers.filter(u => !this.state.safeUsers.includes(u) && !this.state.ooaUsers.includes(u))

  isActive = () => !!(this.state.check || this.state.safeUsers.length || this.state.ooaUsers.length)

  showActivate = () => {
    if (this.state.check == null) {
      return <div>Loading...</div>
    } else if (this.state.check) {
      return (
        <button className="qaButtonOff" onClick={this.endCheck}>Deactivate Safety Check</button>
      )
    }
    else {
      return(
        <button className="qaButton" onClick={this.openModal}>Activate Safety Check</button>
      )
    }
  }

  showCSV = () => {
    if (this.isActive()){
      return (
        <CSVLink className="csvButton" style={{marginLeft: 10}} data={this.state.allUsers} filename={"attendee-list.csv"}>Export to CSV</CSVLink>
      )
    }
  }

  startCheck = () => {
    fbc.database.private.adminableUsersRef().remove()
      .catch (x => console.error(x))
    fbc.database.public.adminRef('check').set(true)
      .catch (x => console.error(x))
  }

  endCheck = () => {
    fbc.database.public.adminRef('check').remove()
    .catch (x => console.error(x))
    .then(() => this.setState({endCheck: true, openVar: true, modalAlert: false}))
  }

  openModal = () => {
    this.setState({openVar: true, endCheck: false})
  }

  closeModal = () => {
    this.setState({openVar: false});
  }

  markComplete(task) {
    fbc.database.public.allRef('tasks').child(task.key).remove()
  }
}

function getExtensionUrl() {
  const urlFormat = 'https://firebasestorage.googleapis.com/v0/b/bazaar-179323.appspot.com/o/extensions%2FVERSIONED_EXTENSION%2Fmobile%2Findex.__platform__.0.46.4.manifest.bundle?module=safeapp&alt=media#plugin'
  const matches = window.location.href.match(/\/extensions\/([^/]+\/[^/]+)\//)
  const versionedExtension = matches[1]
  if (!versionedExtension) return null
  return urlFormat.replace('VERSIONED_EXTENSION', versionedExtension.replace('/', '%2F'))
}

function sortUsers(a,b) {
  const aFirst = a.firstName.toLowerCase()
  const bFirst = b.firstName.toLowerCase()
  const aLast = a.lastName.toLowerCase()
  const bLast = b.firstName.toLowerCase()
  if (aFirst !== bFirst) return aFirst < bFirst ? -1 : 1
  return aLast < bLast ? -1 : 1
}
