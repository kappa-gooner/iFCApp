import React, { Component } from 'react';
import  { TableConstants } from '../Constants/Constants';

import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

let styles = StyleSheet.create({
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
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 3,
        shadowOffset: {
            height: 0,
            width: 0
        },
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
        fontWeight: '400',
        textAlign: 'center'
    },
    doneButton: {
        borderRadius: 5,
        backgroundColor: '#24CE84',
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
            order: this.props.orderItem,
        });
    }

    onDonePressed() {
        this.props.onDone(this.props.userState, this.state.order);
    }

    render() {
        let welcomeText;
        let backgroundColor = '#fff';
        let borderWidth = 1;
        let fontWeight = '100';

        if (this.props.isVendor) {
            if (this.state.order && this.state.order.table < 0) {
                welcomeText = 'Sample Order';
            } else {
                welcomeText = `Table ${TableConstants[this.state.order.table]}`;
            }
        } else {
            if (this.state.order.index === 0) {
                welcomeText = 'Featured Menu!';
                backgroundColor = '#ffffc9';
                borderWidth = 2;
                fontWeight = '200';
            } else {
                welcomeText = `Item #${this.state.order.index}`;
            }
        }

        const orderText = this.props.isVendor ? 'Ready to eat!' : 'Order';

        return (
            <View style={[styles.container, { backgroundColor, borderWidth }]}>
                <Text style={styles.label}>{welcomeText}</Text>
                <View style={[styles.li, { backgroundColor }]}>
                    <Text style={[styles.liText, { fontWeight }]}>{this.state.order.order.main}
                    </Text>
                </View>
                <View style={[styles.li, { backgroundColor }]}>
                    <Text style={[styles.liText, { fontWeight }]}>{this.state.order.order.side}
                    </Text>
                </View>
                <View style={[styles.li, { backgroundColor, borderBottomColor: 'transparent', }]}>
                    <TouchableHighlight
                        onPress={this.onDonePressed.bind(this)}
                        style={styles.doneButton}
                        underlayColor={'#18a165'}
                    >
                        <Text style={{ textAlign: 'center',
                                       color: '#fff' }}>
                            {orderText}
                        </Text>
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
    orderItem: React.PropTypes.shape({})
};

export default OrderItem;
