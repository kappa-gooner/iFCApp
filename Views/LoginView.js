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

import styles from '../Styles/Styles';
import User from '../Models/User';
import AuthService from '../Services/AuthService';

const Item = Picker.Item;

class LoginView extends Component {
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

    onLoginPressed() {
        if (this.state.username !== undefined) {
            console.log('Attempting to log in with username ' + this.state.username);
            console.log('Attempting to log in with customer type ' + this.state.customer);
            this.setState({ showProgress: true });

            const authService = require('../Services/AuthService');
            const user = new User(this.state.username, this.state.customer);
            authService.login(user, (results) => {
                this.setState(Object.assign({
                    showProgress: false
                }, results));

                if (results.success && this.props.onLogin) {
                    AuthService.getUserInfo((err, userInfo) => {
                        this.props.onLogin(userInfo);
                    });
                }
            });
        }
    }

    render() {
        return (
          <View style={styles.container}>
              <Image source={require('../Images/iFClogo.png')}
                  style={styles.logo}
              />
              <Text style={styles.heading}>iFoodCourt</Text>
              <TextInput onChangeText={(text) => { this.setState({ username: text }); }}
                  placeholder="Your Name"
                  style={styles.loginInput}
              />
              <Text style={styles.info}>And you are?</Text>
              <Picker onValueChange={this.onValueChange.bind(this, 'customer')}
                  selectedValue={this.state.customer}
                  style={styles.picker}
              >
                      <Item label="Customer"
                          value="customer"
                      />
                      <Item label="Food stall Vendor"
                          value="vendor"
                      />
                      <Item label="Cleaning Staff"
                          value="cleaner"
                      />
              </Picker>
              <TouchableHighlight onPress={this.onLoginPressed.bind(this)}
                  style={styles.button}
              >
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
}

LoginView.propTypes = {
    onLogin: React.PropTypes.func.isRequired
};

module.exports = LoginView;
