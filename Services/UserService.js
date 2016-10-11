import { createStore } from 'redux';
import {
    AsyncStorage,
} from 'react-native';

import UserStates from '../Constants/UserStates';
import DBService from './DBService';
import User from '../Models/User';

const userKey = 'user';
const usersTable = 'Users/';

const defaultState = {
    user: 'username',
    userType: 'usertype',
    state: UserStates.AWAY,
    table: -1,
};

function updateUserTable(userInfo, newstate) {
    try {
        // Update user info here
        const userData = userInfo;
        userData.state = newstate;

        DBService.getDB().ref(usersTable + userData.user).set({
            user: userData,
        }).then(() => {
            AsyncStorage.setItem(userKey, JSON.stringify(userData));
            console.log('Table updated successfully!');
        }).catch((err) => {
            // Handle errors here
        });
    } catch (error) {
          // Error saving data
    }
}

function userService(state = defaultState, action) {
    switch (action.type) {
    case UserStates.IN_RANGE:
    case UserStates.SEATED:
    case UserStates.ORDERED: {
        const userInfo = action.user;
        updateUserTable(userInfo, action.type);
        return Object.assign({}, state, new User(
            userInfo.user,
            userInfo.userType,
            action.type,
            userInfo.table,
        ));
    }
    default:
        return Object.assign({}, state, action.user);
    }
}
export default createStore(userService);
