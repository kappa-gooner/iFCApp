import React from 'react';

import Beacons from 'react-native-ibeacon';

const MyBeacons = {
    MrBeetroot: {
        identifier: 'MrBeetroot',
        uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
        major: 38763,
        minor: 29448
    },
    MsCandy: {
        identifier: 'MsCandy',
        uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
        major: 55094,
        minor: 49514,
    },
    DrLemon: {
        identifier: 'DrLemon',
        uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
        major: 52872,
        minor: 45572,
    },
};

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
        console.log('Successfully initialized beacons');
    }

    static getBeaconDistance(txPower, rssi) {
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
}

export { BeaconsManager, MyBeacons };
