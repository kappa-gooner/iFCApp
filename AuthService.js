import {
    AsyncStorage,
} from 'react-native';

import _ from 'lodash';

const userKey = 'user';
const userTypeKey = 'type';

class AuthService {
    getUserInfo(cb) {
        AsyncStorage.multiGet([userKey, userTypeKey], (err, val) => {
            if (err) {
                return cb(err);
            }

            if (!val) {
                return cb();
            }

            const result = _.fromPairs(val);

            if (!result[userKey]) {
                return cb();
            }

            const userInfo = {
                user: result[userKey],
                userType: result[userTypeKey],
            };

            return cb(null, userInfo);
        });
    }

    login(creds, cb) {
        AsyncStorage.multiSet([
                [userKey, creds.user],
                [userTypeKey, creds.userType]
        ], (err) => {
            if (err) {
                throw err;
            }
            return cb({ success: true });
        })
        .catch((err) => {
            return cb(err);
        });
    }
}

module.exports = new AuthService();
