import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
} from 'react-native';

import styles from '../Styles/Styles';

class CustomerView extends Component {
    onLogoutPressed() {
        require('../Services/AuthService').logout((results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    render() {
        return (
          <View style={styles.container}>
              <Text style={styles.heading}>Welcome to iFoodCourt {this.props.name}</Text>
              <Text style={styles.info}>Place your order here</Text>
              <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                  style={styles.logoutButton}
              >
                  <Text style={styles.buttonText}>Log out</Text>
              </TouchableHighlight>
          </View>
        );
    }
}

CustomerView.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
};

module.exports = CustomerView;
