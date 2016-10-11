import { createStore } from 'redux';

import UserStates from '../Constants/UserStates';
import DBService from './DBService';
import User from '../Models/User';
import { DB } from '../Constants/Constants';

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

        DBService.getDB().ref(DB.usersTable + userData.user).set({
            user: userData,
        }).then(() => {
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
    case UserStates.ORDERED:
    case UserStates.EATING: {
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
