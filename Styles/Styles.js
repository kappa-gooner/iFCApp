import {
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        paddingTop: 40,
        padding: 10,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-start'
    },
    logo: {
        width: 66,
        height: 55,
    },
    heading: {
        fontSize: 30,
        margin: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    info: {
        fontSize: 20,
        margin: 10,
        marginTop: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    loginInput: {
        height: 50,
        margin: 10,
        padding: 8,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#48BBEC',
    },
    picker: {
        height: 104,
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginBottom: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    logoutButton: {
        height: 50,
        backgroundColor: '#E63462',
        borderColor: '#E63462',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 24,
    },
    loader: {
        marginTop: 20,
    },
    listView: {
        flex: 1,
    },
});

export { styles as default };
