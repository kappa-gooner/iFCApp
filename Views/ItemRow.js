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
        maxWidth: 300,
        width: 300,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: '300',
    },
    doneButton: {
        borderRadius: 5,
        backgroundColor: '#EAEAEA',
        padding: 5,
    },
});

class ItemRow extends Component {
    onDonePressed() {
        this.props.onDone(this.props.userState);
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
                >
                    <Text>Done</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

ItemRow.propTypes = {
    onDone: React.PropTypes.func.isRequired,
    userState: React.PropTypes.string.isRequired,
};

export default ItemRow;
