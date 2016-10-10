import {
    AsyncStorage,
} from 'react-native';

import _ from 'lodash';
import DBService from './DBService';

const userKey = 'user';

class AuthService {
    getUserInfo(cb) {
        AsyncStorage.multiGet([userKey], (err, val) => {
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
            const userInfo = JSON.parse(result[userKey]);

            DBService.getDB().ref(userInfo.user).once('value').then((snapshot) => {
                const user = snapshot.val().user;
                if (user) {
                    return cb(null, user);
                }
                return cb();
            })
            .catch((err) => {
                return cb();
            });
        });
    }

    login(user, cb) {
        DBService.getDB().ref(user.user).set({
            user
        }).then(() => {
            AsyncStorage.multiSet([
              [userKey, JSON.stringify(user)]
            ], (err) => {
                if (err) {
                    throw err;
                }
                return cb({ success: true });
            })
            .catch((err) => {
                return cb(err);
            });
        }).catch((err) => {
            return cb(err);
        });
    }

    logout(username, cb) {
        DBService.getDB().ref(username).set(null).then(() => {
            AsyncStorage.multiRemove([
                userKey
            ], (err) => {
                if (err) {
                    throw err;
                }
                return cb({ success: true });
            })
            .catch((err) => {
                return cb(err);
            });
        })
        .catch((err) => {
            return cb(err);
        });
    }
}

module.exports = new AuthService();
