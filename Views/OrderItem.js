import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';
import _ from 'lodash';

import Menu from '../Constants/MenuConstants';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        padding: 20,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    li: {
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderColor: 'transparent',
        borderWidth: 1,
        paddingLeft: 16,
        paddingTop: 14,
        paddingBottom: 16,
    },
    liText: {
        color: '#333',
        fontSize: 16,
    },
    label: {
        fontSize: 20,
        fontWeight: '300',
        textAlign: 'center'
    },
    doneButton: {
        borderRadius: 5,
        backgroundColor: '#EAEAEA',
        padding: 5,
    },
});

class OrderItem extends Component {
    onDonePressed() {
        this.props.onDone(this.props.userState);
    }

    render() {
        const menuItem = _.sample(Menu);
        const welcomeText = this.props.isVendor ? 'Customer orders' : 'Order Now!';
        const orderText = this.props.isVendor ? 'Ready to eat!' : 'Order';

        return (
            <View style={styles.container}>
                <Text style={styles.label}>{welcomeText}</Text>
                <View style={styles.li}>
                    <Text style={styles.liText}>{menuItem.main}</Text>
                </View>
                <View style={styles.li}>
                    <Text style={styles.liText}>{menuItem.side}</Text>
                </View>
                <View style={styles.li}>
                    <TouchableHighlight
                        onPress={this.onDonePressed.bind(this)}
                        style={styles.doneButton}
                    >
                        <Text style={{ textAlign: 'center' }}>{orderText}</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

OrderItem.propTypes = {
    onDone: React.PropTypes.func.isRequired,
    userState: React.PropTypes.string.isRequired,
    isVendor: React.PropTypes.bool.isRequired,
};

export default OrderItem;
