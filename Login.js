import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    StyleSheet,
    TextInput,
    Picker,
    TouchableHighlight,
} from 'react-native';

const Item = Picker.Item;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingTop: 40,
        padding: 10,
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 66,
        height: 55,
    },
    heading: {
        fontSize: 30,
        margin: 10,
        marginBottom: 20,
    },
    info: {
        fontSize: 20,
        margin: 10,
        marginTop: 20,
        marginBottom: 12,
    },
    loginInput: {
        height: 50,
        margin: 10,
        padding: 8,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#48BBEC',
    },
    picker: {
        height: 104,
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
    },
});

class Login extends Component {
    state = {
        customer: 'customer',
        vendor: 'vendor',
        cleaner: 'cleaner',
    };

    onValueChange = (key: string, value: string) => {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    };

    render() {
        return (
          <View style={styles.container}>
              <Image source={require('./iFClogo.png')}
                  style={styles.logo}/>
              <Text style={styles.heading}>iFoodCourt</Text>
              <TextInput style={styles.loginInput}
                         placeholder="Your Name"/>
              <Text style={styles.info}>And you are?</Text>
              <Picker style={styles.picker}
                      selectedValue={this.state.customer}
                      onValueChange={this.onValueChange.bind(this, 'customer')}
              >
                      <Item label="Customer" value="customer" />
                      <Item label="Food stall Vendor" value="vendor" />
                      <Item label="Cleaning Staff" value="cleaner" />
              </Picker>
              <TouchableHighlight style={styles.button}>
                  <Text style={styles.buttonText}>Log in</Text>
              </TouchableHighlight>
          </View>
        );
    }
}

module.exports = Login;
