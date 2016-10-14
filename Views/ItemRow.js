import React, { Component } from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E7E7E7',
        padding: 20,
        maxHeight: 72,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    label: {
        fontSize: 20,
        fontWeight: '300',
    },
    doneButton: {
        borderRadius: 5,
        backgroundColor: '#24CE84',
        padding: 5,
    },
});

class ItemRow extends Component {
    onDonePressed() {
        this.props.onDone(this.props.userState, this.props.meta);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text
                    style={styles.label}
                >{this.props.userState}</Text>

                <TouchableHighlight
                    onPress={this.onDonePressed.bind(this)}
                    style={styles.doneButton}
                    underlayColor={'#18a165'}
                >
                    <Text style={{ textAlign: 'center',
                                   color: '#fff' }}>
                                   Done
                    </Text>
                </TouchableHighlight>
            </View>
        );
    }
}

ItemRow.propTypes = {
    onDone: React.PropTypes.func.isRequired,
    userState: React.PropTypes.string.isRequired,
    meta: React.PropTypes.shape({}),
};

export default ItemRow;
