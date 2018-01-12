import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import client from '@doubledutch/admin-client'
import CustomMessages from './CustomMessages'
import List from './List'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'safetyapps1')
fbc.initializeAppWithSimpleBackend()

class App extends Component {
  constructor() {
    super()
    this.state = { 
      active: false,
      showButtons: false,
      status: [], 
      check: "", 
      safeUsers: [],
      unknownUsers : [],
      ooaUsers: [],
      allUsers: []
     }
    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount() {

    // this.setState({ allUsers: client.getUsers()})

    this.signin.then(() => {
      client.getUsers().then(users => {
      this.setState({allUsers: users, unknownUsers: users})
      const sharedRef = fbc.database.public.adminRef("checks")
      const adminableRef = fbc.database.private.adminableUsersRef()
    
      sharedRef.on('child_added', data => {
        // this.setState({ check: [...this.state.check, {...data.val(), key: data.key }], active: true })
        this.setState({ check: {...data.val(), key: data.key}, active: true })
      })

      // sharedRef.on('child_changed', data => {
      //   console.log
      //   this.setState({ check: data.val(), active: true })
      // })

      adminableRef.on('child_added', data => {
          var newUser = this.state.unknownUsers.filter(newUser => 
            newUser.id === data.key
          )
          var newList = this.state.unknownUsers.filter(newUser => 
            newUser.id !== data.key
          )
          if (data.val().status === "safe"){
            this.setState({ safeUsers: this.state.safeUsers.concat(newUser), unknownUsers: newList, active: true })
          }
          if (data.val().status === "OOA"){
            this.setState({ ooaUsers: this.state.safeUsers.concat(newUser), unknownUsers: newList, active: true })
          }
      })

      adminableRef.on('child_changed', data => {
          var newUser = this.state.unknownUsers.filter(newUser => 
            newUser.id === data.key
          )
          var newList = this.state.unknownUsers.filter(newUser => 
            newUser.id !== data.key
          )
          if (data.val() === "safe"){
            this.setState({ safeUsers: this.state.safeUsers.concat(newUser), unknownUsers: newList, active: true })
          }
          if (data.val() === "OOA"){
            this.setState({ ooaUsers: this.state.safeUsers.concat(newUser), unknownUsers: newList, active: true })
          } 
      })

    
      sharedRef.on('child_removed', data => {
        this.setState({ check: "", active: false, currentStatus: false})
      }) 
    })
  })
    .catch(err => console.error(err))

    
  }

  render() {
    return (
      <div className="App">
      {this.activeCheck()}
      </div>
    )
  }


  activeCheck = () => {
    if (this.state.active) {
      return (
        <span>
          <div className="topBox">
            <p className='bigBoxTitle'>{'Safety Check'}</p>
            <button className="qaButtonOff" onClick={this.endCheck}>Deactivate Safety Check</button>
          </div>
          <CustomMessages
          active = {this.state.showButtons}
          />
          <div className="statusesBox">
          <List
          listData = {this.state.unknownUsers}
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
        </span>
      )
    }
    else {
      return (
        <div className="topBox">
          <p className='bigBoxTitle'>{'Safety Check'}</p>
          <button className="qaButton" onClick={this.startCheck}>Activate Safety Check</button>
        </div>
      )
    }
  }

  startCheck = () => {
    this.setState({active: true, check: [], ooaUsers: [], safeUsers: [], unknownUsers: this.state.allUsers })
    fbc.database.private.adminableUsersRef().remove()
    .catch (x => console.error(x))
    fbc.database.public.adminRef('checks').push(true)
    .catch (x => console.error(x))
  }

  endCheck = () => {
    var mod = this.state.check
    fbc.database.public.adminRef('checks').child(mod.key).remove()
    .catch (x => console.error(x))
  }

  markComplete(task) {
    fbc.database.public.allRef('tasks').child(task.key).remove()
  }
}


export default App
