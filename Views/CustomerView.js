import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    DeviceEventEmitter,
} from 'react-native';

import styles from '../Styles/Styles';
import { BeaconsManager, MyBeacons } from '../Services/BeaconsManager';

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
        console.log('Entered region: ' + data.region);
        if (data) {
            this.setState({
                isBeaconRange: true,
                beaconRegion: data.region.identifier,
            });
        }
    }

    exitedRegion(data) {
        console.log('Exited region: ' + data.region);
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
                const nearestBeacon = BeaconsManager.getNearestBeacon(beaconData.beacons);
                if ({}.hasOwnProperty.call(MyBeacons, beaconData.region.identifier)
                     && nearestBeacon) {
                    this.enteredRegion(beaconData);
                    this.setState({
                        beaconProximity:
                          Math.trunc(BeaconsManager.getBeaconDistance(-74, nearestBeacon.rssi)),
                    });
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

    render() {
        if (this.state.isBeaconRange) {
            return (
                <View style={styles.container}>
                <Text style={styles.heading}>Welcome to iFoodCourt {this.props.userInfo.user}</Text>
                <Text style={styles.info}>You're in the range of {this.state.beaconRegion},
                    this beacon is currently {this.state.beaconProximity}m away!</Text>
                <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                    style={styles.logoutButton}
                >
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableHighlight>
            </View>);
        } else {
            return (
              <View style={styles.container}>
                  <Text style={styles.heading}>Welcome to iFoodCourt {this.props.userInfo.user}
                  </Text>
                  <Text style={styles.info}>However, you're not in the
                        proximity of our foodcourt!</Text>
                  <TouchableHighlight onPress={this.onLogoutPressed.bind(this)}
                      style={styles.logoutButton}
                  >
                      <Text style={styles.buttonText}>Log out</Text>
                  </TouchableHighlight>
              </View>
            );
        }
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
