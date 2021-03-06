import React from 'react';
import Beacons from 'react-native-ibeacon';

import MyBeacons from '../Constants/BeaconsInfo';
import DBService from './DBService';
import { DB, AppConstants } from '../Constants/Constants';

const beaconPower = -62; // -74 for low power (-12dB), -62 for hi power (0db)

class BeaconsManager {
    static initializeBeacons() {
        // Authorize app to use bluetooth when in use
        Beacons.requestWhenInUseAuthorization();

        // Start monitoring for beacons
        Object.keys(MyBeacons).forEach((beaconKey) => {
            const beacon = MyBeacons[beaconKey];
            Beacons.startMonitoringForRegion(beacon);
            Beacons.startRangingBeaconsInRegion(beacon);
        });

        Beacons.startUpdatingLocation();
        Beacons.shouldDropEmptyRanges(true);
    }

    static getBeaconDistance(rssi) {
        const txPower = beaconPower;
        if (rssi === 0) {
            return -1.0;
        }

        const ratio = (rssi * 1.0) / txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio, 10);
        }
        else {
            const accuracy = ((0.89976) * Math.pow(ratio, 7.7095)) + 0.111;
            return accuracy;
        }
    }

    static getNearestBeacon(beaconData) {
        let nearestBeacon;
        let nearestBeaconsDistance = -1;
        beaconData.forEach((beacon) => {
            const distance = this.getBeaconDistance(-74, beacon.rssi);
            if (distance > -1 &&
                    (distance < nearestBeaconsDistance || nearestBeacon === undefined)) {
                nearestBeacon = beacon;
                nearestBeaconsDistance = distance;
            }
        });
        return nearestBeacon;
    }

    static isLocatorBeacon(identifier) {
        // Return if the beacon ranging is indeed a 'locator' beacon
        return (identifier === MyBeacons.MrBeetroot.identifier);
    }

    static findEmptyTable() {
        return DBService.getDB().ref(DB.beaconsTable).once('value').then((snapshot) => {
            const beacons = snapshot.val();
            let freeBeacon;
            Object.keys(beacons).forEach((identifier) => {
                const beacon = beacons[identifier];

                if (beacon.type === AppConstants.reserve && beacon.state === AppConstants.free) {
                    freeBeacon = beacon;
                }
            });

            if (freeBeacon) {
                this.updateBeaconTable(freeBeacon, AppConstants.occupied);
            }
            return freeBeacon;
        })
        .catch((error) => {
            // Handle DB error
        });
    }

    static updateBeaconTable(beaconInfo, newstate) {
        try {
            // Update user info here
            const beaconData = beaconInfo;
            beaconData.state = newstate;

            DBService.getDB().ref(DB.beaconsTable + beaconData.identifier).set({
                identifier: beaconData.identifier,
                state: beaconData.state,
                table: beaconData.table,
                type: beaconData.type,
            }).then(() => {
                console.log('Beacon Table updated successfully!');
            }).catch((err) => {
                // Handle errors here
            });
        } catch (error) {
              // Error saving data
        }
    }
}

export { BeaconsManager as default };
