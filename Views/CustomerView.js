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
import UserStates from '../Constants/UserStates';
import userService from '../Services/UserService';
import orderService from '../Services/OrderService';
import Order from '../Models/Order';
import { BeaconsManager } from '../Services/BeaconsManager';

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

        // Subscribe to changes in the userService
        this.storeSubscription = userService.subscribe(() => {
            this.setState({ // eslint-disable-line react/no-set-state
                userInfo: userService.getState(),
            });
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
    }

    componentWillUnmount() {
        if (this.customerViewListener) {
            this.customerViewListener.remove();
        }
        this.storeSubscription();
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
                if (this.state.userInfo.state === UserStates.AWAY
                    || this.state.userInfo.state === UserStates.IN_RANGE) {
                    if (BeaconsManager.isLocatorBeacon(beaconData.region.identifier)) {
                        this.enteredRegion(beaconData);
                        this.setState({
                            beaconProximity: Math.trunc(BeaconsManager.getBeaconDistance(-74,
                                    beaconData.beacons[0].rssi)),
                        });
                    }
                }
            }
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
            console.log('Finding table!!');
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
            console.log('Handling: ' + UserStates.SEATED);
            // Update 'Orders table'
            orderService.dispatch({
                type: UserStates.ORDER_PENDING,
                order: new Order(order, userState, userInfo.table, userInfo.user),
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

    render() {
        let welcomeMsg = <Text style={styles.info}>However, you're not in the
              proximity of our foodcourt!</Text>;
        let initialDisplay = <Text/>;
        let orderDisplay = <Text/>;

        if (this.state.userInfo.state !== UserStates.AWAY) {
            welcomeMsg = <Text style={styles.info}>You're in the range of {this.state.beaconRegion},
                this beacon is currently {this.state.beaconProximity}m away!</Text>;
            initialDisplay = (<ItemRow onDone={this.onDone.bind(this)}
                userState={this.state.userInfo.state}
                              />);
        }

        if (this.state.userInfo.state === UserStates.SEATED) {
            orderDisplay = (<OrderItem isVendor={false}
                onDone={this.onDone.bind(this)}
                userState={this.state.userInfo.state}
                            />);
        }

        return (
            <View style={styles.container}>
            <ScrollView
              scrollEventThrottle={200}
             >
             <Text style={styles.heading}>Welcome to iFoodCourt {this.state.userInfo.user}</Text>
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
