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
import './App.css'
import client, { translate as t, useStrings } from '@doubledutch/admin-client'
import { provideFirebaseConnectorToReactComponent } from '@doubledutch/firebase-connector'
import { CSVLink } from 'react-csv'
import CustomMessages from './CustomMessages'
import List from './List'
import i18n from './i18n'
import CustomModal from './Modal'

useStrings(i18n)

class App extends PureComponent {
  constructor(props) {
    super(props)
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
      modalMessage: '',
    }
    this.signin = props.fbc
      .signinAdmin()
      .then(user => (this.user = user))
      .catch(err => console.error(err))
  }

  componentDidMount() {
    const { fbc } = this.props
    this.signin
      .then(() => {
        client.getAttendees().then(users => {
          this.setState({ allUsers: users.sort(sortUsers) })
          const checkRef = fbc.database.public.adminRef('check')
          const adminableRef = fbc.database.private.adminableUsersRef()

          checkRef.on('value', data => {
            const check = data.val() || false
            this.setState({ check, showButtons: true, endCheck: false, openVar: false })
          })

          adminableRef.on('child_added', data => {
            const newUser = users.find(newUser => newUser.id === data.key)
            if (newUser) {
              if (data.val().status === 'safe') {
                newUser.status = 'Safe'
                const safeUsers = this.state.safeUsers.concat(newUser)
                safeUsers.sort(sortUsers)
                this.setState({ safeUsers })
              }
              if (data.val().status === 'OOA') {
                newUser.status = 'Out of Area'
                const ooaUsers = this.state.ooaUsers.concat(newUser)
                ooaUsers.sort(sortUsers)
                this.setState({ ooaUsers })
              }
            }
          })

          adminableRef.on('value', data => {
            if (data.val() == null) {
              this.setState({ ooaUsers: [], safeUsers: [], showButtons: true })
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
          openVar={this.state.openVar}
          closeModal={this.closeModal}
          startCheck={this.startCheck}
          endCheck={this.state.endCheck}
          active={this.state.showButtons}
          allUsers={this.state.allUsers}
          modalMessage={this.state.modalMessage}
          modalAlert={this.state.modalAlert}
        />
        <div className="topBox">
          <p className="bigBoxTitle">{t('title')}</p>
          {this.showActivate()}
          {this.showCSV()}
        </div>
        <CustomMessages
          active={this.state.check}
          sendPush={this.sendPushMessage}
          sendPost={this.sendPromotedMessage}
          testMessage={t('pushMsg')}
        />
        {this.showActiveCheck()}
      </div>
    )
  }

  sendPushMessage = pushMessage => {
    const message = pushMessage.trim()
    if (message) {
      client
        .cmsRequest('POST', '/api/messages', {
          Type: 'Push',
          Text: pushMessage,
          Schedule: {
            Now: true,
            TimeZoneId: 7,
          },
          UserGroups: [],
          LinkTypeId: 3,
          LinkText: t('amSafe'),
          LinkValue: getExtensionUrl(),
        })
        .then(() => {
          this.setState({
            openVar: true,
            modalAlert: true,
            modalMessage: 'Push Notification sent.',
            endCheck: false,
          })
        })
        .catch(error => {
          alert(t('pushRetry'))
        })
    } else {
      alert(t('pushError'))
    }
  }

  sendPromotedMessage = promotedMessage => {
    const message = promotedMessage.trim()
    if (message) {
      client
        .cmsRequest('POST', '/api/messages', {
          Type: 'Promoted',
          Text: promotedMessage,
          Schedule: {
            Now: true,
            DurationInMinutes: 20,
          },
          LinkTypeId: 3,
          LinkText: 'I Am Safe',
          LinkValue: getExtensionUrl(),
        })
        .then(() => {
          this.setState({
            openVar: true,
            modalAlert: true,
            modalMessage: 'Promoted Post created.',
            endCheck: false,
          })
        })
        .catch(error => {
          alert(t('postRetry'))
        })
    } else {
      alert(t('postError'))
    }
  }

  showActiveCheck = () => {
    if (this.isActive()) {
      return (
        <div className="statusesBox">
          <List listData={this.unknownUsers()} listName={t('noStatus')} />
          <List listData={this.state.safeUsers} listName={t('markedSafe')} />
          <List listData={this.state.ooaUsers} listName={t('OOA')} />
        </div>
      )
    }
  }

  unknownUsers = () =>
    this.state.allUsers.filter(
      u => !this.state.safeUsers.includes(u) && !this.state.ooaUsers.includes(u),
    )

  isActive = () => !!(this.state.check || this.state.safeUsers.length || this.state.ooaUsers.length)

  showActivate = () => {
    if (this.state.check == null) {
      return <div>{t('loading')}</div>
    }
    if (this.state.check) {
      return (
        <button className="qaButtonOff" onClick={this.endCheck}>
          {t('deactivate')}
        </button>
      )
    }

    return (
      <button className="qaButton" onClick={this.openModal}>
        {t('activate')}
      </button>
    )
  }

  showCSV = () => {
    if (this.isActive()) {
      return (
        <CSVLink
          className="csvButton"
          style={{ marginLeft: 10 }}
          data={this.state.allUsers}
          filename="attendee-list.csv"
        >
          {t('export')}
        </CSVLink>
      )
    }
  }

  startCheck = () => {
    const { fbc } = this.props
    fbc.database.private
      .adminableUsersRef()
      .remove()
      .catch(x => console.error(x))
    fbc.database.public
      .adminRef('check')
      .set(true)
      .catch(x => console.error(x))
  }

  endCheck = () => {
    this.props.fbc.database.public
      .adminRef('check')
      .remove()
      .catch(x => console.error(x))
      .then(() => this.setState({ endCheck: true, openVar: true, modalAlert: false }))
  }

  openModal = () => {
    this.setState({ openVar: true, endCheck: false })
  }

  closeModal = () => {
    this.setState({ openVar: false })
  }

  markComplete(task) {
    this.props.fbc.database.public
      .allRef('tasks')
      .child(task.key)
      .remove()
  }
}

export default provideFirebaseConnectorToReactComponent(
  client,
  'safeapp',
  (props, fbc) => <App {...props} fbc={fbc} />,
  PureComponent,
)

// This hacky URL can be replaced with dd://extensions/safeapp in the fall of 2019 (a year after 8.1, which supports this, was released)
function getExtensionUrl() {
  return 'dd://extensions/safeapp'
}

function sortUsers(a, b) {
  const aFirst = a.firstName.toLowerCase()
  const bFirst = b.firstName.toLowerCase()
  const aLast = a.lastName.toLowerCase()
  const bLast = b.firstName.toLowerCase()
  if (aFirst !== bFirst) return aFirst < bFirst ? -1 : 1
  return aLast < bLast ? -1 : 1
}
