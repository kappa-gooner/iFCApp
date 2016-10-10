import {
    AsyncStorage,
} from 'react-native';

import UserStates from '../Constants/UserStates';

const userKey = 'user';

class UserService {
    static handleUserAction(action) {
        switch (action.Type) {
        case UserStates.IN_RANGE:
            this.updateUserTable(action.Payload, action.Type);
            break;
        default:
                // Do nothing
        }
    }

    static updateUserTable(userInfo, newstate) {
        try {
            // Update user info here
            const userData = userInfo;
            userData.state = newstate;

            AsyncStorage.setItem(userKey, JSON.stringify(userData));
            console.log('Table updated successfully!');
        } catch (error) {
              // Error saving data
        }
    }
}

export { UserService as default }
