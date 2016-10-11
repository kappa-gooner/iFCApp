import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    ScrollView,
    ListView,
} from 'react-native';
import _ from 'lodash';

import styles from '../Styles/Styles';
import OrderItem from './OrderItem';
import UserStates from '../Constants/UserStates';
import userService from '../Services/UserService';
import orderService from '../Services/OrderService';
import DBService from '../Services/DBService';
import Menu from '../Constants/MenuConstants';
import Order from '../Models/Order';
import User from '../Models/User';

const ordersTable = 'Orders';
const sampleMenu = {
    order: _.sample(Menu),
    table: -1,
    user: '',
};
let ordersRef;

class VendorView extends Component {
    constructor(props) {
        super(props);

        // Assign base state
        this.state = Object.assign({}, {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
        });
    }

    componentWillMount() {
        ordersRef = DBService.getDB().ref(ordersTable);

        ordersRef.on('value', (snap) => {
            this.ordersTableUpdated(snap.val());
        });

        this.setState({ // eslint-disable-line react/no-set-state
            dataSource: this.state.dataSource.cloneWithRows([sampleMenu]),
        });
    }

    componentWillUnmount() {
        ordersRef.off();
    }

    ordersTableUpdated(update) {
        const orders = [sampleMenu];
        if (update && update.length > 0) {
            update.forEach((child) => {
                orders.push(child.order);
            });
        }

        this.setState({ // eslint-disable-line react/no-set-state
            dataSource: this.state.dataSource.cloneWithRows(orders),
        });
    }

    onLogoutPressed() {
        require('../Services/AuthService').logout(this.props.userInfo.user, (results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    onDone(userState, order = null) {
        console.log(userState);
        if (order !== null) {
            const orderState = order.state;
            switch (orderState) {
            case UserStates.ORDER_PENDING: {
                // Update Order DB to ORDER_READY (Delete entry from DB)
                orderService.dispatch({
                    type: UserStates.ORDER_READY,
                    order: new Order(order.order, orderState, order.table, order.user),
                });
                // Update user status to 'EATING'
                userService.dispatch({
                    type: UserStates.EATING,
                    user: new User(order.user, 'customer', UserStates.ORDERED, order.table),
                });
                break;
            }
            default:
                // Do nothing
            }
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
              <ListView
                  dataSource={this.state.dataSource}
                  enableEmptySections={true}
                  renderRow={this._renderItem.bind(this)}
                  style={styles.listview}/>
              <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                  style={styles.logoutButton}
              >
                  <Text style={styles.buttonText}>Log out</Text>
              </TouchableHighlight>
          </ScrollView>
          </View>
        );
    }

    _renderItem(item) {
        return (
            <OrderItem isVendor={true} onDone={this.onDone.bind(this)}
                orderItem={item}
                userState={this.props.userInfo.state}
            />
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
