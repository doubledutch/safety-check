import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import ReactDOM from 'react-dom'
import client, {Color} from '@doubledutch/admin-client'

export default class CustomMessages extends Component {
    constructor(props){
        super(props)
        this.state = {
            pushMessage: this.props.testMessage,
            promotedMessage: this.props.testMessage
        }
    }

    pushMessageChanged = (event) => {
        this.setState({pushMessage: event.target.value});
    }

    promotedMessageChanged = (event) => {
        this.setState({promotedMessage: event.target.value});
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
                    <p className="boxTitle">
                    Push Message
                    </p>
                    <form>
                        <textarea className="questionInput" type="message" maxLength="140" value={this.state.pushMessage} onChange={this.pushMessageChanged} />
                    </form>
                    <div className="buttonBox">
                        <p className="buttonText">(Linked to Safety Check)</p>
                        <button className="publishButton" onClick={this.sendPush}>Submit</button>
                    </div>
                </span>
                <span className="questionBox">
                    <p className="boxTitle">
                    Promoted Post
                    </p>
                    <form>
                        <textarea className="questionInput" type="post" maxLength="140" value={this.state.promotedMessage} onChange={this.promotedMessageChanged} />
                    </form>
                    <div className="buttonBox">
                            <p className="buttonText">(Linked to Safety Check)</p>
                            <p className="buttonText">Pinned for 3 hours</p>
                            <button className="publishButton" onClick={this.sendPost}>Submit</button>
                    </div>
                </span>  
            </div>
            )
        }
    }

    render(){
        return (
            <div>
            {this.showButtons()}
            </div>
        )
    }
}
