/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import LoginView from './Views/LoginView';
import CustomerView from './Views/CustomerView';
import VendorView from './Views/VendorView';
import CleanerView from './Views/CleanerView';

import AuthService from './Services/AuthService';

import baseStyles from './Styles/Styles';

const styles = Object.assign(baseStyles, {
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

class iFCApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            checkingAuth: true,
            user: '',
            userType: ''
        };

        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        AuthService.getUserInfo((err, userInfo) => {
            this.setState({
                checkingAuth: false,
                isLoggedIn: userInfo != null,
            });

            if (this.state.isLoggedIn) {
                this.setLoginState({
                    user: userInfo.user,
                    userType: userInfo.userType,
                });
            }
        });
    }

    onLogin(userInfo) {
        this.setLoginState(userInfo);
    }

    setLoginState(userInfo) {
        this.setState({
            isLoggedIn: true,
            user: userInfo.user,
            userType: userInfo.userType,
        });
    }

    onLogout() {
        this.setState({ isLoggedIn: false });
    }

    render() {
        if (this.state.checkingAuth) {
            return (
              <View style={styles.container}>
                <ActivityIndicator
                    animating = {true}
                    size="large"
                    style={styles.loader}
                />
              </View>
            );
        }

        if (this.state.isLoggedIn) {
            switch (this.state.userType) {
                case 'customer':
                  return (
                    <CustomerView name={this.state.user}
                        onLogout={this.onLogout}
                    />
                  );
                case 'vendor':
                  return (
                    <VendorView name={this.state.user}
                        onLogout={this.onLogout}
                    />
                  );
                case 'cleaner':
                  return (
                    <CleanerView name={this.state.user}
                        onLogout={this.onLogout}
                    />
                  );
                default :
                  return (
                    <View style={styles.container}>
                      <Text style={styles.welcome}>Logged in!</Text>
                    </View>
                  );
            }
        } else {
            return (
              <LoginView onLogin={this.onLogin} />
            );
        }
    }
}

AppRegistry.registerComponent('iFCApp', () => iFCApp);
