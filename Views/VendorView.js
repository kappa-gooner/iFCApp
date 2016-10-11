import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    ScrollView,
} from 'react-native';

import styles from '../Styles/Styles';
import OrderItem from './OrderItem';
import UserStates from '../Constants/UserStates';
import userService from '../Services/UserService';

class VendorView extends Component {
    constructor(props) {
        super(props);

        // Assign base state
        this.state = Object.assign({}, {
            userInfo: userService.getState(),
        });

        // Subscribe to changes in the userService
        this.storeSubscription = userService.subscribe(() => {
            this.setState({ // eslint-disable-line react/no-set-state
                userInfo: userService.getState(),
            });
        });
    }

    componentDidMount() {
        userService.dispatch({
            type: '',
            user: this.props.userInfo,
        });
    }

    componentWillUnmount() {
        this.storeSubscription();
    }

    onLogoutPressed() {
        require('../Services/AuthService').logout(this.state.userInfo.user, (results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    onDone(orderState) {
        console.log(orderState);
        switch (orderState) {
        case UserStates.ORDER_PENDING: {
            // Update Order DB to ORDER_READY (Delete entry from DB)
            // Update user status to 'EATING'
        }
        default:
            // Do nothing
        }
    }

    render() {
        return (
          <View style={styles.container}>
          <ScrollView
              scrollEventThrottle={200}
          >
              <Text style={styles.heading}>Hello {this.props.userInfo.user}</Text>
              <Text style={styles.info}>Here are the orders that have been placed:</Text>
              <OrderItem isVendor={true} onDone={this.onDone.bind(this)}
                  userState={this.state.userInfo.state}
              />
              <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                  style={styles.logoutButton}
              >
                  <Text style={styles.buttonText}>Log out</Text>
              </TouchableHighlight>
          </ScrollView>
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
