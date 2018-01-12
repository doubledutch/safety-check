import React, { Component } from 'react'
import ReactNative, {
  KeyboardAvoidingView, Platform, TouchableOpacity, Text, TextInput, View, ScrollView
} from 'react-native'

export class Buttons extends Component {
  constructor(props) {
      super(props)
      this.state = {
      }
  }

    renderButtons = () => {
        if (this.props.checkStatus && this.props.currentStatus === false){
            return(
            <View style={{padding:20, paddingTop: 0, backgroundColor: "white"}}>
                <TouchableOpacity onPress={()=>{ this.props.markSafe()}}>
                    <View style={{backgroundColor:'#62BB00',borderRadius:4, height: 50, justifyContent: 'center', alignItems: 'center',}}>
                        <Text style={{color:"#FFFFFF",textAlign:'center',fontSize:18, fontWeight: "500"}}>I am Safe</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{ this.props.markOOA()}} style={{marginTop:20}}>
                    <View style={{backgroundColor:'#ECECEC',borderRadius:4, height: 50, justifyContent: 'center', alignItems: 'center',}}>
                        <Text style={{textAlign:'center',fontSize:18, fontWeight: "500"}}>I am Not in the Area</Text>
                    </View>
                </TouchableOpacity>
            </View>
            )
        }

        

    }

  render(){
    return (
        <View>
            {this.renderButtons()}
        </View>
        )
    }

}


const s = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    button: {
        borderColor: this.buttonColor,
        borderWidth:1,
        backgroundColor:'#FFFFFF',
        borderRadius:4, 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
    }

})