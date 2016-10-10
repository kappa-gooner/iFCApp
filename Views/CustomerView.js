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
import UserService from '../Services/UserService';
import { BeaconsManager } from '../Services/BeaconsManager';

class CustomerView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isBeaconRange: false,
            beaconRegion: '',
            beaconProximity: 'unknown',
        };
    }

    componentDidMount() {
        BeaconsManager.initializeBeacons();
        this.customerViewListener = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
            this.beaconsInRange(data);
        });
    }

    componentWillUnmount() {
        this.customerViewListener.remove();
    }

    enteredRegion(data) {
        if (data) {
            this.setState({
                isBeaconRange: true,
                beaconRegion: data.region.identifier,
            });
            UserService.handleUserAction({
                Type: UserStates.IN_RANGE,
                Payload: this.props.userInfo,
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
                if (this.props.userInfo.state === UserStates.AWAY) {
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
        require('../Services/AuthService').logout((results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    onDone(userState) {
        switch (userState) {
        case UserStates.IN_RANGE:
            // BeaconsManager.findEmptyTable();
            break;
        case UserStates.SEATED:
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
                userState={this.props.userInfo.state}
                                />);
        }
        console.log('Users current state: ' + this.props.userInfo.state);
        return (
            <View style={styles.container}>
            <Text style={styles.heading}>Welcome to iFoodCourt {this.props.userInfo.user}</Text>
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
