import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import ReactDOM from 'react-dom'
import client, {Color} from '@doubledutch/admin-client'


class CustomMessages extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: "Please enter a test notification",
            secondValue: "Please enter a test post"
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleChange2 = (event) => {
        this.setState({secondValue: event.target.value});
    }

      handleSubmit = (event) => {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
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
                            <textarea className="questionInput" type="message" maxlength="140" value={this.state.value} onChange={this.handleChange} />
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
                            <textarea className="questionInput" type="post" maxlength="140" value={this.state.secondValue} onChange={this.handleChange2} />
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

export default CustomMessages