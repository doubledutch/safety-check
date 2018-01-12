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
            secondValue: "Second test"
        }
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }


    // handleChange = (event) => {
    //     console.log(event.target.type)
    //     if (event.target.type === "message"){
    //         console.log("here")
    //     this.setState({value: event.target.value});
    //   }

    //   if (event.target.type === "post"){
    //     this.setState({secondValue: event.target.value});
    //   }
    // }

    handleChange2 = (event) => {
        this.setState({secondValue: event.target.value});
    }

      handleSubmit = (event) => {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
      }


    render(){

        

        return (
            <div className="messages">
                <span className="questionBox">
                    <p className="boxTitle">
                    Push Message
                    </p>
                    <form>
                        {/* <input className ="questionInput" type="text" name="name" /> */}
                        <textarea className="questionInput" type="message" value={this.state.value} onChange={this.handleChange} />
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
                        {/* <input className ="questionInput" type="text" name="name" /> */}
                        <textarea className="questionInput" type="post" value={this.state.secondValue} onChange={this.handleChange2} />
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

export default CustomMessages