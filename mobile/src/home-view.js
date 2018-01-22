import React, { Component } from 'react'
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView, Image
} from 'react-native'
import {Status} from './Status'
import {Buttons} from './Buttons'
import client, { Avatar, TitleBar } from '@doubledutch/rn-client'
import FirebaseConnector from '@doubledutch/firebase-connector'
const fbc = FirebaseConnector(client, 'safetycheck')
fbc.initializeAppWithSimpleBackend()

export default class HomeView extends Component {
  constructor() {
    super()
    this.state = { 
      status: "", 
      check: [], 
      checkStatus: false, 
      currentStatus: false
    }

    this.signin = fbc.signinAdmin()
      .then(user => this.user = user)
      .catch(err => console.error(err))
  }

  componentDidMount() {
    this.signin.then(() => {
      const sharedRef = fbc.database.public.adminRef("checks")
      const userRef = fbc.database.private.adminableUserRef()

      sharedRef.on('child_added', data => {
        this.setState({ check: data.val(), checkStatus: true })
      })

      sharedRef.on('child_removed', data => {
        this.setState({check: "", status: "", checkStatus: false, currentStatus: false })
      })

      userRef.on('child_added', data => {
        this.setState({ status: data.val(), currentStatus: true })
      })

      userRef.on('child_changed', data => {
        this.setState({ status: data.val(), currentStatus: true })
      })
     
    })
  }


  showButtons = () => {
    if (this.state.checkStatus && this.state.currentStatus !== undefined) {
      return (
        <Buttons
        checkStatus = {this.state.checkStatus}
        currentStatus = {this.state.currentStatus}
        markSafe = {this.markSafe}
        markOOA = {this.markOOA}
        />
      )
    }
  }

  render() {
    return (
      <View title="" style={{ flex: 1,backgroundColor:'#E8E8E8' }}>
        <TitleBar title="Safety Check" client={client} signin={this.signin} />
        <ScrollView style={s.container}>
          <Status
          checkStatus = {this.state.checkStatus}
          currentStatus = {this.state.currentStatus}
          status = {this.state.status}
          userID = {client.currentUser.id}
          />
          {this.showButtons()}
        </ScrollView>
      </View>
    )
  }

  markSafe = () => {
    fbc.database.private.adminableUserRef("status").set("safe")
    .catch (x => console.error(x))
  }

  markOOA = () => {
    fbc.database.private.adminableUserRef("status").set("OOA")
    .catch (x => console.error(x))
  }

 
}


const fontSize = 18
const s = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d9e1f9',
  },
  scroll: {
    flex: 1,
    padding: 15
  },
  task: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  checkmark: {
    textAlign: 'center',
  },
  creatorAvatar: {
    marginRight: 4
  },
  creatorEmoji: {
    marginRight: 4,
    fontSize
  },
  taskText: {
    fontSize,
    flex: 1
  },
  compose: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10
  },
  sendButtons: {
    justifyContent: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    margin: 5
  },
  sendButtonText: {
    fontSize: 20,
    color: 'gray'
  },
  composeText: {
    flex: 1
  }
})
