import React, { Component } from 'react'
import './App.css'
import Modal  from 'react-modal'
import ReactDOM from 'react-dom'
import client, {Color} from '@doubledutch/admin-client'


class List extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: "Please enter a test notification",
            secondValue: "Second test"
        }
    }

    renderIcons = () => {
        switch(this.props.listName) {
            case "Marked As Safe" :
            return(
                <img className='button1' src={require('./icons/checkocircle.png')}/>
            )

            case "Not in Area" :
            return(
                <img className='button2' src={require('./icons/check.png')}/>
            )
        
    }
}

    listData = () => {
        if (this.props.listData){
            const users = this.props.listData;
            const listItems = users.map((user) =>
              <li className="listItem">
                <span className="listItemBox">
                    <p className="itemTitle">
                        {user.firstName + " " + user.lastName}
                    </p>
                    {this.renderIcons()}
                </span>
              </li>
            );
            return (
              <ul className="list">{listItems}</ul>
            );
        }

    }


    render(){
        let total = 0
        if (this.props.listData) {
            total = this.props.listData.length
        }
        return(
            <span className="listBox">
            <p className="boxTitle">
            {this.props.listName + " (" + total + ")" }
            </p>
            {this.listData()}
            </span>
        )
    }

}


export default List
