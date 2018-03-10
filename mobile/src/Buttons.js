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