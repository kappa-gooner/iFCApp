import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    DeviceEventEmitter,
} from 'react-native';

import styles from '../Styles/Styles';
import ItemRow from './ItemRow';
import UserStates from '../Constants/UserStates';
import userService from '../Services/UserService';
import { BeaconsManager } from '../Services/BeaconsManager';

class CustomerView extends Component {
    constructor(props) {
        super(props);

        let localState = {
            isBeaconRange: false,
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
        this.customerViewListener.remove();
        this.storeSubscription();
    }

    enteredRegion(data) {
        if (data) {
            this.setState({
                isBeaconRange: true,
                beaconRegion: data.region.identifier,
            });
            userService.dispatch({
                type: UserStates.IN_RANGE,
                user: this.state.userInfo,
            });
        }
    }

    exitedRegion(data) {
        if (data) {
            this.setState({
                isBeaconRange: false,
                beaconRegion: '',
            });
        }
    }

    beaconsInRange(beaconData) {
        if (beaconData) {
            if (beaconData.beacons && beaconData.beacons.length > 0) {
                if (this.state.userInfo.state === UserStates.AWAY) {
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

    onDone(userState) {
        switch (userState) {
        case UserStates.IN_RANGE: {
            BeaconsManager.findEmptyTable()
                    .then((freeTable) => {
                        if (freeTable) {
                            const userInfo = this.state.userInfo;
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
        case UserStates.SEATED:
            console.log('Need to handle: ' + UserStates.SEATED);
            // 1) Simulate order
            // 2) Push 'order to vendors'
            // 3) Set state to 'ORDERED'
            break;
        default:
            // Do nothing
        }
    }

    render() {
        let welcomeMsg = <Text style={styles.info}>However, you're not in the
              proximity of our foodcourt!</Text>;
        let userStateDisplay = <Text/>;

        if (this.state.isBeaconRange) {
            welcomeMsg = <Text style={styles.info}>You're in the range of {this.state.beaconRegion},
                this beacon is currently {this.state.beaconProximity}m away!</Text>;
            userStateDisplay = (<ItemRow onDone={this.onDone.bind(this)}
                userState={this.state.userInfo.state}
                                />);
        }
        
        return (
            <View style={styles.container}>
            <Text style={styles.heading}>Welcome to iFoodCourt {this.state.userInfo.user}</Text>
            {welcomeMsg}
            {userStateDisplay}
            <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                style={styles.logoutButton}
            >
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableHighlight>
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
