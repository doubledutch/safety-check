import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import ReactDOM from 'react-dom'
import {CSVLink, CSVDownload} from 'react-csv';
import client, {Color} from '@doubledutch/admin-client'

export class CustomModal extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: ''
        }
    }

    render() {
        const questions = this.props.questions
        return(
        <Modal 
        isOpen={this.props.openVar}
        onAfterOpen={this.props.afterOpenModal}
        onRequestClose={this.props.closeModal}
        contentLabel="Modal"
        className="Modal"
        overlayClassName="Overlay"
        >
            <div>
                {this.modalX()}
                <div className="modalTextBox">
                    {this.modalMessage()}
                </div>
                <div className="modalButtonBox">
                    {this.modalButtons()}
                </div >    
            </div>
        </Modal>
        )
    }

    handleChange = (event) => {
      this.setState({[event.target.name]: event.target.value});
    }

    modalX = () => {
        if (this.props.active) {
            return (
                <button className="closeButton" onClick={this.props.endCheck}>X</button>
            )
        }
        else {
            return(
                <button className="closeButton" onClick={this.props.closeModal}>X</button>
            )
        }
    }

    modalMessage = () => {
        if (this.props.active) {
            return (
                <div>
                <p className="modalHeadline">Safety Check has been deactivated</p>
                <p className="modalText">We suggest sending a push message alerting your attendees the event area is safe.</p>
                <p className="modalText">Would you like to export the attendee check-in lists?</p>
                </div>
            )
        }
        else {
              return (
                <div>
                <p className="modalHeadline">Confirm to activate Safety Check</p>
                <p className="modalText">We suggest sending a push message & creating a promoted post alerting your attendees about the incident and to check-in.</p>
                <p className="modalText">Are you sure you want to active a Safety Check?</p>
                </div>
            )
        }
    }

    modalButtons = () => {
        if (this.props.active) {
            return (
                <div>
                    <button className="modalExport1" onClick={this.props.makeExport}>Export to CSV</button>
                    <button className="modalDone" onClick={this.props.endCheck}>Done</button>
                </div>
            )
        }
        else {
            return (
                <div>
                    <button className="modalExport1" onClick={this.props.startCheck}>Activate</button>
                    <button className="modalDone" onClick={this.props.closeModal}>Cancel</button>
                </div>
            )
        }
    }


  handleSubmit = (event) => {
      this.props.newSession(this.state.value)
  }

 
}

export default CustomModal