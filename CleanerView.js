import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
} from 'react-native';

import styles from './Styles';

class CleanerView extends Component {
    render() {
        return (
          <View style={styles.container}>
              <Text style={styles.heading}>Hello {this.props.name}</Text>
              <Text style={styles.info}>Here are the tables that need to be cleaned:</Text>
              <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                  style={styles.logoutButton}>
                  <Text style={styles.buttonText}>Log out</Text>
              </TouchableHighlight>
          </View>
        );
    }

    onLogoutPressed() {
        require('./AuthService').logout((results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            }});
    }
}

module.exports = CleanerView;
