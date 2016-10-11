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
import DBService from './Services/DBService';

import baseStyles from './Styles/Styles';

import { AppConstants } from './Constants/Constants';

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
            userInfo: null,
        };

        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        DBService.initialize();
        AuthService.getUserInfo((err, userInfo) => {
            this.setState({
                checkingAuth: false,
                isLoggedIn: userInfo != null,
            });

            if (this.state.isLoggedIn) {
                this.setLoginState(userInfo);
            }
        });
    }

    onLogin(userInfo) {
        this.setLoginState(userInfo);
    }

    setLoginState(userInfo) {
        this.setState({
            isLoggedIn: true,
            userInfo,
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

        if (this.state.isLoggedIn && this.state.userInfo != null) {
            switch (this.state.userInfo.userType) {
            case AppConstants.customer:
                return (
                <CustomerView onLogout={this.onLogout}
                    userInfo={this.state.userInfo}
                />
              );
            case AppConstants.vendor:
                return (
                <VendorView onLogout={this.onLogout}
                    userInfo={this.state.userInfo}
                />
              );
            case AppConstants.cleaner:
                return (
                <CleanerView onLogout={this.onLogout}
                    userInfo={this.state.userInfo}
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
