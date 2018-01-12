import React, { Component } from 'react'
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView
} from 'react-native'



export class Status extends Component {
  constructor(props) {
      super(props)

  }

  renderMessage = () => {
      const userID = this.props.userID

      if (this.props.currentStatus) {
        if (this.props.status === "safe") {
            return (
            <View>
                <Text style={s.message}>
                You've been marked as safe.
                </Text>
            </View>
            )
        }
        if (this.props.status === "OOA") {
            return (
                <View>
                    <Text style={s.message}>
                    You've been marked as out of area.
                    </Text>
                </View>
                )
            }
      }

      else {
        if (this.props.checkStatus){
            return (
            <View>
                <Text style={s.message}>
                There has been an incident 
                {"\n"}
                affecting the event area
                </Text>
                <Text style={s.secondMessage}>
                Are you Safe?
                </Text>
            </View>
            )
        }
      else {
        return (
        <View>
            <Text style={s.message}>
            In the event of an emergency, please navigate to this page to mark yourself as safe and alert the event organizer.
            </Text>
        </View>
        )
      }
    }
  }


  render(){
    return (
        <View style={s.container}>
            <View style={s.iconBox}>
                <Text style={{flex: 1, textAlign: "center", fontSize: 24, fontWeight: "500", color: "#a9a9a9", margin: 10}}>
                    Safety Check
                </Text>
            </View>
            <View style={s.messageBox}>
                {this.renderMessage()}
            </View>
        </View>
    )
  }


}


const s = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },

    iconBox: {
        flex: 1,
        margin: 20,
        borderBottomColor: '#a9a9a9',
        borderBottomWidth: 1
    },

    messageBox: {
        flex: 1,
        margin: 20,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },

    message: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
    },

    secondMessage: {
        flex: 1,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
        marginTop: 5
    }


})

