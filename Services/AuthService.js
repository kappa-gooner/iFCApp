import {
    AsyncStorage,
} from 'react-native';

import _ from 'lodash';
import DBService from './DBService';
import DB from '../Constants/Constants';

class AuthService {
    getUserInfo(cb) {
        AsyncStorage.multiGet([DB.userKey], (err, val) => {
            if (err) {
                return cb(err);
            }

            if (!val) {
                return cb();
            }
            const result = _.fromPairs(val);

            if (!result[DB.userKey]) {
                return cb();
            }
            const userInfo = JSON.parse(result[DB.userKey]);

            DBService.getDB().ref(DB.usersTable + userInfo.user).once('value').then((snapshot) => {
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
        DBService.getDB().ref(DB.usersTable + user.user).set({
            user
        }).then(() => {
            AsyncStorage.multiSet([
              [DB.userKey, JSON.stringify(user)]
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
        DBService.getDB().ref(DB.usersTable + username).set(null).then(() => {
            AsyncStorage.clear();
            return cb({ success: true });
        })
        .catch((err) => {
            return cb(err);
        });
    }
}

module.exports = new AuthService();
