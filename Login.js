import React, { Component } from 'react';

import {
    Text,
    View,
    Image,
    TextInput,
    Picker,
    TouchableHighlight,
    ActivityIndicator,
} from 'react-native';

import styles from './Styles';

const Item = Picker.Item;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,

            // user type states
            customer: 'customer',
            vendor: 'vendor',
            cleaner: 'cleaner',
        };
    }

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
              <TextInput onChangeText={(text) => this.setState({ username: text})}
                         style={styles.loginInput}
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
              <TouchableHighlight onPress={this.onLoginPressed.bind(this)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Log in</Text>
              </TouchableHighlight>
              <ActivityIndicator
                  animating={this.state.showProgress}
                  size="large"
                  style={styles.loader}
              />
          </View>
        );
    }

    onLoginPressed() {
        if (this.state.username !== undefined) {
            console.log('Attempting to log in with username ' + this.state.username);
            console.log('Attempting to log in with customer type ' + this.state.customer);
            this.setState({ showProgress: true });

            const authService = require('./AuthService');
            authService.login({
                user: this.state.username,
                userType: this.state.customer
            }, (results) => {
                this.setState(Object.assign({
                    showProgress: false
                }, results));

                if (results.success && this.props.onLogin) {
                    this.props.onLogin({
                        user: this.state.username,
                        userType: this.state.customer
                    });
                }
            });
        }
    }
}

module.exports = Login;
