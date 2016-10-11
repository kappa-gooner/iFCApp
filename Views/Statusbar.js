import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';

import styles from '../Styles/Styles';

class Statusbar extends Component {
  render() {
    return (
      <View>
        <View style={styles.statusbar}/>
        <View style={styles.navbar}>
          <Text style={styles.navbarTitle}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

module.exports = Statusbar;
