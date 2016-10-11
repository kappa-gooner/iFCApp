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
    constructor(props) {
        super(props);

        this.state = {
            order: {},
        };
    }

    componentWillMount() {
        this.setState({
            order: _.sample(Menu),
        });
    }

    onDonePressed() {
        this.props.onDone(this.props.userState, this.state.order);
    }

    render() {
        const welcomeText = this.props.isVendor ? '' : 'Order Now!';
        const orderText = this.props.isVendor ? 'Ready to eat!' : 'Order';

        return (
            <View style={styles.container}>
                <Text style={styles.label}>{welcomeText}</Text>
                <View style={styles.li}>
                    <Text style={styles.liText}>{this.state.order.main}</Text>
                </View>
                <View style={styles.li}>
                    <Text style={styles.liText}>{this.state.order.side}</Text>
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
