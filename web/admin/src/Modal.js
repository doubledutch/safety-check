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
import Modal from 'react-modal'
import { translate as t } from '@doubledutch/admin-client'
import { CSVLink } from 'react-csv'

export class CustomModal extends Component {
  state = { value: '' }

  render() {
    const { openVar, afterOpenModal, closeModal } = this.props
    return (
      <Modal
        ariaHideApp={false}
        isOpen={openVar}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <div>
          {this.modalX()}
          <div className="modalTextBox">{this.modalMessage()}</div>
          <div className="modalButtonBox">{this.modalButtons()}</div>
        </div>
      </Modal>
    )
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  modalX = () => {
    if (this.props.active) {
      return (
        <button className="closeButton" onClick={this.props.closeModal}>
          X
        </button>
      )
    }

    return (
      <button className="closeButton" onClick={this.props.closeModal}>
        X
      </button>
    )
  }

  modalMessage = () => {
    if (this.props.endCheck) {
      return (
        <div>
          <p className="modalHeadline">{t('deactivateMsg')}</p>
          <p className="modalText">{t('suggestText')}</p>
          <p className="modalText">{t('exportQ')}</p>
        </div>
      )
    }

    if (this.props.modalAlert) {
      return (
        <div>
          <p className="modalHeadline">{t('success')}</p>
          <p className="modalText" style={{ marginBottom: 75 }}>
            {this.props.modalMessage}
          </p>
        </div>
      )
    }

    return (
      <div>
        <p className="modalHeadline">{t('activateConfirm')}</p>
        <p className="modalText">{t('suggestPushMsg')}</p>
        <p className="modalText">{t('confirmQ')}</p>
      </div>
    )
  }

  modalButtons = () => {
    const { endCheck, allUsers, closeModal, modalAlert } = this.props
    if (endCheck) {
      return (
        <div>
          <CSVLink className="modalExport" data={allUsers} filename="attendee-list.csv">
            {t('export')}
          </CSVLink>
          <button type="button" className="modalDone" onClick={closeModal}>
            {t('done')}
          </button>
        </div>
      )
    }

    if (modalAlert) {
      return (
        <div>
          <button
            type="button"
            className="modalDone"
            style={{ marginLeft: 30 }}
            onClick={closeModal}
          >
            {t('done')}
          </button>
        </div>
      )
    }

    return (
      <div>
        <button className="modalExport1" onClick={this.props.startCheck}>
          {t('act')}
        </button>
        <button className="modalDone" onClick={this.props.closeModal}>
          {t('cancel')}
        </button>
      </div>
    )
  }

  handleSubmit = () => {
    this.props.newSession(this.state.value)
  }
}

export default CustomModal
