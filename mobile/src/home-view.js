/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { PureComponent } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import client, { TitleBar, translate as t, useStrings } from '@doubledutch/rn-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { Status } from './Status'
import { Buttons } from './Buttons'
import i18n from './i18n'

useStrings(i18n)

if (Text.defaultProps) Text.defaultProps.allowFontScaling = false

class HomeView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      status: '',
      check: null,
      checkStatus: false,
      currentStatus: false,
    }

    this.signin = props.fbc.signin().then(user => (this.user = user))

    this.signin.catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    this.signin.then(() => {
      const checkRef = fbc.database.public.adminRef('check')
      const userRef = fbc.database.private.adminableUserRef()

      checkRef.on('value', data => {
        const check = data.val()
        if (check) {
          this.setState({ check, checkStatus: true })
        } else {
          this.setState({ check: null, status: '', checkStatus: false, currentStatus: false })
        }
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
          checkStatus={this.state.checkStatus}
          currentStatus={this.state.currentStatus}
          markSafe={this.markSafe}
          markOOA={this.markOOA}
        />
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#E8E8E8' }}>
        <TitleBar title={t('title')} client={client} signin={this.signin} />
        <ScrollView style={s.container}>
          <Status
            checkStatus={this.state.checkStatus}
            currentStatus={this.state.currentStatus}
            status={this.state.status}
          />
          {this.showButtons()}
        </ScrollView>
      </View>
    )
  }

  markSafe = () => {
    this.props.fbc.database.private
      .adminableUserRef('status')
      .set('safe')
      .catch(x => console.error(x))
  }

  markOOA = () => {
    this.props.fbc.database.private
      .adminableUserRef('status')
      .set('OOA')
      .catch(x => console.error(x))
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'safeapp',
  (props, fbc) => <HomeView {...props} fbc={fbc} />,
  PureComponent,
)

const fontSize = 18
const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEDEDE',
  },
  scroll: {
    flex: 1,
    padding: 15,
  },
  task: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkmark: {
    textAlign: 'center',
  },
  creatorAvatar: {
    marginRight: 4,
  },
  creatorEmoji: {
    marginRight: 4,
    fontSize,
  },
  taskText: {
    fontSize,
    flex: 1,
  },
  compose: {
    height: 70,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
  },
  sendButtons: {
    justifyContent: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    margin: 5,
  },
  sendButtonText: {
    fontSize: 20,
    color: 'gray',
  },
  composeText: {
    flex: 1,
  },
})
