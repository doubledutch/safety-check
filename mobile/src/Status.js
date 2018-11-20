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
import { StyleSheet, Text, View, Image } from 'react-native'

export class Status extends Component {
  renderMessage = () => {
    if (this.props.currentStatus) {
      if (this.props.status === 'safe') {
        return (
          <View>
            <Text style={s.message}>You've been marked as safe.</Text>
          </View>
        )
      }
      if (this.props.status === 'OOA') {
        return (
          <View>
            <Text style={s.message}>You've been marked as not in area.</Text>
          </View>
        )
      }
    } else {
      if (this.props.checkStatus) {
        return (
          <View>
            <Text style={s.message}>
              There has been an incident
              {'\n'}
              affecting the event area
            </Text>
            <Text style={s.secondMessage}>Are you Safe?</Text>
          </View>
        )
      }

      return (
        <View>
          <Text style={s.message}>
            In the event of an emergency, please navigate to this page to mark yourself as safe and
            alert the event organizer.
          </Text>
        </View>
      )
    }
  }

  renderIcon = () => {
    if (this.props.currentStatus) {
      return (
        <Image
          style={{ width: 50, height: 50, margin: 1, flex: 1, alignSelf: 'center' }}
          source={{
            uri: 'https://dml2n2dpleynv.cloudfront.net/extensions/safety-check/checkocircle@2x.png',
          }}
        />
      )
    }

    return (
      <Image
        style={{ width: 50, height: 50, margin: 1, flex: 1, alignSelf: 'center' }}
        source={{
          uri:
            'https://dml2n2dpleynv.cloudfront.net/extensions/safety-check/checkocircle_grey@2x.png',
        }}
      />
    )
  }

  render() {
    return (
      <View style={s.container}>
        <View style={s.iconBox}>
          {this.renderIcon()}
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 24,
              fontWeight: '500',
              color: '#4A4A4A',
              margin: 10,
            }}
          >
            Safety Check
          </Text>
        </View>
        <View style={s.messageBox}>{this.renderMessage()}</View>
      </View>
    )
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  iconBox: {
    flex: 1,
    margin: 20,
    borderBottomColor: '#a9a9a9',
    borderBottomWidth: 1,
    padding: 1,
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
    textAlign: 'center',
    fontSize: 18,
    color: '#4a4a4a',
  },
  secondMessage: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 5,
  },
})
