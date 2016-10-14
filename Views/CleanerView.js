import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    ScrollView,
    ListView,
} from 'react-native';

import Statusbar from './Statusbar';
import styles from '../Styles/Styles';
import DBService from '../Services/DBService';
import BeaconsManager from '../Services/BeaconsManager';
import ItemRow from './ItemRow';
import { DB, AppConstants } from '../Constants/Constants';

const sampleTable = {
    identifier: 'SamplePumpkin',
    state: 'UNCLEAN',
    table: -1,
    type: 'RESERVE',
};

let beaconsRef;

class CleanerView extends Component {
    constructor(props) {
        super(props);

        // Assign base state
        this.state = Object.assign({}, {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => {} }),
        });
    }

    componentWillMount() {
        beaconsRef = DBService.getDB().ref(DB.beaconsTable);

        beaconsRef.on('value', (snap) => {
            this.beaconsTableUpdated(snap.val());
        });

        this.setState({ // eslint-disable-line react/no-set-state
            dataSource: this.state.dataSource.cloneWithRows([sampleTable]),
        });
    }

    componentWillUnmount() {
        beaconsRef.off();
    }

    beaconsTableUpdated(update) {
        let tables = [sampleTable];
        if (update) {
            Object.keys(update).forEach((key) => {
                tables.push(update[key]);
            });
            tables = tables.filter(item => (item.state === AppConstants.unclean));
        }

        this.setState({ // eslint-disable-line react/no-set-state
            dataSource: this.state.dataSource.cloneWithRows(tables),
        });
    }

    onDone(tableState, table = null) {
        if (table !== null && table.table !== -1) {
            BeaconsManager.updateBeaconTable(table, AppConstants.free);
        }
    }

    onLogoutPressed() {
        require('../Services/AuthService').logout(this.props.userInfo.user, (results) => {
            if (results.success && this.props.onLogout) {
                this.props.onLogout();
            } });
    }

    render() {
        const statusbarMsg = `Welcome back, ${this.props.userInfo.user}`;

        return (
          <View style={styles.container}>
              <ScrollView
                  scrollEventThrottle={200}
              >
                  <Statusbar title={statusbarMsg} />
                  <Text style={styles.info}>Here are the tables that need to be cleaned:</Text>
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
        return (<ItemRow meta={item}
            onDone={this.onDone.bind(this)}
            userState={item.identifier}
                />);
    }
}

CleanerView.propTypes = {
    onLogout: React.PropTypes.func.isRequired,
    userInfo: React.PropTypes.shape({
        user: React.PropTypes.string,
        userType: React.PropTypes.string,
        state: React.PropTypes.string,
        table: React.PropTypes.number,
    }).isRequired,
};

module.exports = CleanerView;
