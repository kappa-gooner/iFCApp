/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 22,
        textAlign: 'center',
        margin: 10,
        fontWeight: 'bold',
    },
    instructions: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333333',
        marginTop: 10,
        marginBottom: 5,
    },
});

class iFCApp extends Component {
    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.welcome}>
              Welcome to the iFoodCourt App
            </Text>
            <Text style={styles.instructions}>
              This is a MT5003 project prototype
            </Text>
            <Text style={styles.instructions}>
              To get started, edit index.ios.js
            </Text>
            <Text style={styles.instructions}>
              Press Cmd+R to reload,{'\n'}
              Cmd+D or shake for dev menu
            </Text>
          </View>
        );
    }
}

AppRegistry.registerComponent('iFCApp', () => iFCApp);
