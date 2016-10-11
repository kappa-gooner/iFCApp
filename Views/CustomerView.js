import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    DeviceEventEmitter,
    ScrollView,
} from 'react-native';

import styles from '../Styles/Styles';
import ItemRow from './ItemRow';
import OrderItem from './OrderItem';
import Statusbar from './Statusbar';
import UserStates from '../Constants/UserStates';
import userService from '../Services/UserService';
import orderService from '../Services/OrderService';
import DBService from '../Services/DBService';
import LocationService from '../Services/LocationService';
import Order from '../Models/Order';
import { BeaconsManager } from '../Services/BeaconsManager';
import { DB, TableConstants } from '../Constants/Constants';

let usersRef;

class CustomerView extends Component {
    constructor(props) {
        super(props);

        const localState = {
            beaconRegion: '',
            beaconProximity: 'unknown',
        };

        // Assign base state
        this.state = Object.assign({}, localState, {
            userInfo: userService.getState(),
        });
    }

    componentDidMount() {
        BeaconsManager.initializeBeacons();
        this.customerViewListener = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            this.beaconsInRange(data);
        });

        userService.dispatch({
            type: '',
            user: this.props.userInfo,
        });

        usersRef = DBService.getDB().ref(DB.usersTable + this.props.userInfo.user);

        usersRef.on('value', (snap) => {
            this.usersTableUpdated(snap.val());
        });
    }

    componentWillUnmount() {
        if (this.customerViewListener) {
            this.customerViewListener.remove();
        }
        usersRef.off();
    }

    enteredRegion(data) {
        if (data) {
            this.setState({
                beaconRegion: data.region.identifier,
            });

            if (this.state.userInfo.state !== UserStates.IN_RANGE) {
                userService.dispatch({
                    type: UserStates.IN_RANGE,
                    user: this.state.userInfo,
                });
            }
        }
    }

    exitedRegion(data) {
        if (data) {
            this.setState({
                beaconRegion: '',
            });
        }
    }

    beaconsInRange(beaconData) {
        if (beaconData) {
            if (beaconData.beacons && beaconData.beacons.length > 0) {
                const userstate = this.state.userInfo.state;
                if (LocationService.isYetToOrder(userstate)) {
                    if (BeaconsManager.isLocatorBeacon(beaconData.region.identifier)) {
                        this.enteredRegion(beaconData);
                        this.updateDistanceString(beaconData.beacons[0].rssi);
                    }
                } else if (LocationService.isSeatedAtTable(userstate)) {
                    if (beaconData.region.identifier ===
                            TableConstants[this.state.userInfo.table]) {
                        this.updateDistanceString(beaconData.beacons[0].rssi);
                    }
                }
            }
        }
    }

    updateDistanceString(rssi) {
        const distanceFromBeacon = Math.trunc(BeaconsManager.getBeaconDistance(rssi));
        let displayStr;
        if (distanceFromBeacon < 0) {
            displayStr = ' this beacon\'s location is currently unknown!';
        } else {
            displayStr = ` this beacon is currently ${distanceFromBeacon}m away!`
        }

        this.setState({
            beaconProximity: displayStr,
        });
    }

    onLogoutPressed() {
        require('../Services/AuthService').logout(this.state.userInfo.user, (results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    onDone(userState, order = null) {
        const userInfo = this.state.userInfo;
        switch (userState) {
        case UserStates.IN_RANGE: {
            BeaconsManager.findEmptyTable()
                    .then((freeTable) => {
                        if (freeTable) {
                            userInfo.table = freeTable.table;

                            userService.dispatch({
                                type: UserStates.SEATED,
                                user: userInfo,
                            });
                        }
                        else {
                            // Unable to find free tables!!!
                        }
                    });
            break;
        }
        case UserStates.SEATED: {
            // Update 'Orders table'
            orderService.dispatch({
                type: UserStates.ORDER_PENDING,
                order: new Order(order.order, userState, userInfo.table, userInfo.user),
            });
            // Set user state to Ordered
            userService.dispatch({
                type: UserStates.ORDERED,
                user: userInfo,
            });
            break;
        }
        default:
            // Do nothing
        }
    }

    usersTableUpdated(update) {
        if (update) {
            this.setState({ // eslint-disable-line react/no-set-state
                userInfo: update.user,
            });
        }
    }

    render() {
        // Initial states
        const statusbarMsg = `Welcome to iFC, ${this.state.userInfo.user}`;
        let welcomeMsg = <Text/>;
        let initialDisplay = <Text/>;
        let orderDisplay = <Text/>;

        const userstate = this.state.userInfo.state;

        if (LocationService.isAway(userstate)) {
            welcomeMsg = (<Text style={styles.info}>However, you're not in the
                  proximity of our foodcourt!</Text>
                          );
        } else if (LocationService.isInRange(userstate)) {
            welcomeMsg = <Text style={styles.info}>You're in the range of {this.state.beaconRegion},
                {this.state.beaconProximity}</Text>;
        }

        if (LocationService.isInsideFoodcourt(userstate)) {
            initialDisplay = (<ItemRow onDone={this.onDone.bind(this)}
                userState={userstate}
                              />);
        }

        if (LocationService.isSeatedAtTable(userstate)) {
            const tableName = TableConstants[this.state.userInfo.table];
            welcomeMsg = <Text style={styles.info}>You can seat yourself at {tableName},
                {this.state.beaconProximity}</Text>;
            orderDisplay = (<OrderItem isVendor={false}
                onDone={this.onDone.bind(this)}
                userState={userstate}
                            />);
        }

        return (
            <View style={styles.container}>
            <ScrollView
              scrollEventThrottle={200}
             >
             <Statusbar title={statusbarMsg} />
             {welcomeMsg}
             {initialDisplay}
             {orderDisplay}
             <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                 style={styles.logoutButton}
             >
                 <Text style={styles.buttonText}>Log out</Text>
             </TouchableHighlight>
          </ScrollView>
        </View>);
    }
}

CustomerView.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
    userInfo: React.PropTypes.shape({
        user: React.PropTypes.string,
        userType: React.PropTypes.string,
        state: React.PropTypes.string,
        table: React.PropTypes.number,
    }).isRequired,
};

module.exports = CustomerView;
