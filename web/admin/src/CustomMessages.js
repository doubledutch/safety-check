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

import React, { Component } from 'react'
import './App.css'

export default class CustomMessages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pushMessage: this.props.testMessage,
      promotedMessage: this.props.testMessage,
    }
  }

  pushMessageChanged = event => {
    this.setState({ pushMessage: event.target.value })
  }

  promotedMessageChanged = event => {
    this.setState({ promotedMessage: event.target.value })
  }

  sendPush = () => {
    this.props.sendPush(this.state.pushMessage)
  }

  sendPost = () => {
    this.props.sendPost(this.state.promotedMessage)
  }

  showButtons = () => {
    if (this.props.active) {
      return (
        <div className="messages">
          <span className="questionBox">
            <p className="boxTitle">Push Message</p>
            <form>
              <textarea
                className="questionInput"
                type="message"
                maxLength="140"
                value={this.state.pushMessage}
                onChange={this.pushMessageChanged}
              />
              <p className="counterText">{140 - this.state.pushMessage.length}</p>
            </form>
            <div className="buttonBox">
              <p className="buttonText">(Linked to Safety Check)</p>
              <button className="publishButton" onClick={this.sendPush}>
                Publish
              </button>
            </div>
          </span>
          <span className="questionBox">
            <p className="boxTitle">Promoted Post</p>
            <form>
              <textarea
                className="questionInput"
                type="post"
                maxLength="140"
                value={this.state.promotedMessage}
                onChange={this.promotedMessageChanged}
              />
              <p className="counterText">{140 - this.state.promotedMessage.length}</p>
            </form>
            <div className="buttonBox">
              <p className="buttonText">(Linked to Safety Check)</p>
              <p className="buttonText">Pinned for 3 hours</p>
              <button className="publishButton" onClick={this.sendPost}>
                Publish
              </button>
            </div>
          </span>
        </div>
      )
    }
  }

  render() {
    return <div>{this.showButtons()}</div>
  }
}
