import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
} from 'react-native';

import styles from '../Styles/Styles';

class VendorView extends Component {
    onLogoutPressed() {
        require('../Services/AuthService').logout(this.props.userInfo.user, (results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    render() {
        return (
          <View style={styles.container}>
              <Text style={styles.heading}>Hello {this.props.userInfo.user}</Text>
              <Text style={styles.info}>Here are the orders that have been placed:</Text>
              <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                  style={styles.logoutButton}
              >
                  <Text style={styles.buttonText}>Log out</Text>
              </TouchableHighlight>
          </View>
        );
    }
}

VendorView.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
    userInfo: React.PropTypes.shape({
        user: React.PropTypes.string,
        userType: React.PropTypes.string,
        state: React.PropTypes.string,
        table: React.PropTypes.number,
    }).isRequired,
};

module.exports = VendorView;
