import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    DeviceEventEmitter,
    ScrollView,
    ListView,
} from 'react-native';
import _ from 'lodash';

import styles from '../Styles/Styles';
import ItemRow from './ItemRow';
import OrderItem from './OrderItem';
import Statusbar from './Statusbar';
import  UserStates, { DisplayMessages }  from '../Constants/UserStates';
import userService from '../Services/UserService';
import orderService from '../Services/OrderService';
import DBService from '../Services/DBService';
import LocationService from '../Services/LocationService';
import Order from '../Models/Order';
import Menu from '../Constants/MenuConstants';
import BeaconsManager from '../Services/BeaconsManager';
import { DB, TableConstants, AppConstants } from '../Constants/Constants';

let usersRef;

class CustomerView extends Component {
    constructor(props) {
        super(props);

        const localState = {
            beaconRegion: '',
            beaconProximity: ' this place\'s location is currently unknown!',
        };

        // Assign base state
        this.state = Object.assign({}, localState, {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => {} }),
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

        // Menu display
        const arr = [];
        let index = 0;
        _.forIn(_.shuffle(Menu), (value) => {
            if (index < 11) {
                arr.push({ order: value, index });
                index += 1;
            }
        });

        this.setState({ // eslint-disable-line react/no-set-state
            dataSource: this.state.dataSource.cloneWithRows(arr),
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

            // This is triggered only when user is away
            if (!LocationService.isInRange(this.state.userInfo.state)) {
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
            if (beaconData.beacons) {
                // Sort beacons based on signal strength
                const beacons = beaconData.beacons
                                .filter(item => item.rssi < 0)
                                .sort((a, b) =>
                                    a.rssi - b.rssi
                                );
                                // .map(item => item.rssi);
                const region = beaconData.region;
                const userstate = this.state.userInfo.state;

                if (beacons && beacons.length > 0) {
                    if (LocationService.isYetToOrder(userstate)) {
                        if (BeaconsManager.isLocatorBeacon(region.identifier)) {
                            this.enteredRegion(beaconData);
                            this.updateDistanceString(beacons[0].rssi);
                        }
                    } else if (LocationService.isSeatedAtTable(userstate)) {
                        if (region.identifier ===
                                TableConstants[this.state.userInfo.table]) {
                            this.updateDistanceString(beacons[0].rssi);
                        }
                    } else if (LocationService.isEating(userstate)) {
                        if (region.identifier ===
                                TableConstants[this.state.userInfo.table]) {
                            this.handleUserEatingDistance(beacons[0].rssi);
                        }
                    }
                }
            }
        }
    }

    updateDistanceString(rssi) {
        const distanceFromBeacon = Math.trunc(BeaconsManager.getBeaconDistance(rssi));
        let displayStr;
        if (distanceFromBeacon < 0) {
            displayStr = ' this place\'s location is currently unknown!';
        } else {
            displayStr = ` this place is currently ${distanceFromBeacon}m away!`
        }

        this.setState({
            beaconProximity: displayStr,
        });
    }

    handleUserEatingDistance(rssi) {
        const distanceFromBeacon = Math.trunc(BeaconsManager.getBeaconDistance(rssi));
        if (distanceFromBeacon < 4) {
            this.updateDistanceString(rssi);
        } else {
            // Set table to 'UNCLEAN'
            BeaconsManager.updateBeaconTable({
                table: this.state.userInfo.table,
                identifier: TableConstants[this.state.userInfo.table],
                state: AppConstants.occupied,
                type: AppConstants.reserve,
            }, AppConstants.unclean);
            // Set user to AWAY
            userService.dispatch({
                type: UserStates.AWAY,
                user: Object.assign(this.state.userInfo, {
                    table: -1,
                }),
            });
        }
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

        // Welcome messages when the user is away or inside the foodcourt
        if (LocationService.isAway(userstate)) {
            welcomeMsg = (<Text style={styles.info}>However, you're not in the
                  proximity of our foodcourt!</Text>
                          );
        } else if (LocationService.isInRange(userstate)) {
            welcomeMsg = <Text style={styles.info}>You're in the range of our foodcourt,
                {this.state.beaconProximity}</Text>;
        } else if (LocationService.isSeatedAtTable(userstate)) {
            const tableName = TableConstants[this.state.userInfo.table];
            welcomeMsg = <Text style={styles.info}>You can seat yourself at {tableName},
                {this.state.beaconProximity}</Text>;
            orderDisplay = (<ListView
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={this._renderItem.bind(this)}
                style={styles.listview}
                            />);
        } else if (LocationService.isEating(userstate)) {
            const tableName = TableConstants[this.state.userInfo.table];
            welcomeMsg = <Text style={styles.info}>You're enjoying your meal at {tableName},
                {this.state.beaconProximity}</Text>;
        }

        // Generic status display when user is inside the foodcourt
        if (LocationService.isInsideFoodcourt(userstate)) {
			display = DisplayMessages.hasOwnProperty(userstate) ? DisplayMessages[userstate] : userstate;
            initialDisplay = (<ItemRow onDone={this.onDone.bind(this)}
                userState={display}
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

    _renderItem(item) {
        return (
            <OrderItem isVendor={false} onDone={this.onDone.bind(this)}
                orderItem={item}
                userState={this.state.userInfo.state}
            />
        );
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
