import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import ReactDOM from 'react-dom'
import client, {Color} from '@doubledutch/admin-client'

export default class CustomMessages extends Component {
    constructor(props){
        super(props)
        this.state = {
            pushMessage: "A security incident has occurred. Mark yourself 'safe' if you are okay.",
            promotedMessage: "A security incident has occurred. Mark yourself 'safe' if you are okay."
        }
    }

    pushMessageChanged = (event) => {
        this.setState({pushMessage: event.target.value});
    }

    promotedMessageChanged = (event) => {
        this.setState({promotedMessage: event.target.value});
    }

    handleSubmit = (event) => {
        alert('A name was submitted: ' + this.state.pushMessage);
        event.preventDefault();
    }

    sendPromotedMessage = () => {
        client.cmsRequest('POST', '/api/messages', {
            Type: 'Promoted',
            Text: this.state.promotedMessage,
            Schedule: {
                Now: true,
                DurationInMinutes: 20
            },
            LinkTypeId: 3,
            LinkText: 'Check in',
            LinkValue: 'https://firebasestorage.googleapis.com/v0/b/bazaar-179323.appspot.com/o/extensions%2Fsafeapp%2F0.1.0%2Fmobile%2Findex.__platform__.0.46.4.manifest.bundle?module=safeapp&alt=media#plugin'
        }).then(() => {
            alert('Promoted message posted')
        })
    }

    sendPushMessage = () => {
        client.cmsRequest('POST', '/api/messages', {
            Type: 'Push',
            Text: this.state.pushMessage,
            Schedule: {
                Now: true
            },
            LinkTypeId: 3,
            LinkText: 'Check in',
            LinkValue: 'https://firebasestorage.googleapis.com/v0/b/bazaar-179323.appspot.com/o/extensions%2Fsafeapp%2F0.1.0%2Fmobile%2Findex.__platform__.0.46.4.manifest.bundle?module=safeapp&alt=media#plugin'
        }).then(() => {
            alert('Push message sent')
        })
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
                        <textarea className="questionInput" type="message" maxlength="140" value={this.state.pushMessage} onChange={this.pushMessageChanged} />
                        <div className="buttonBox">
                            <p className="buttonText">(Linked to Safety Check)</p>
                            <input className="publishButton" type="submit" value="Submit" />
                        </div>
                    </form>
                </span>
                <span className="questionBox">
                    <p className="boxTitle">
                    Promoted Post
                    </p>
                    <form>
                        <textarea className="questionInput" type="post" maxlength="140" value={this.state.promotedMessage} onChange={this.promotedMessageChanged} />
                        <div className="buttonBox">
                            <p className="buttonText">(Linked to Safety Check)</p>
                            <p className="buttonText">Pinned for 3 hours</p>
                            <input className="publishButton" type="submit" value="Submit" />
                        </div>
                    </form>
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
