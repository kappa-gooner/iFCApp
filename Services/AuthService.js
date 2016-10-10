import {
    AsyncStorage,
} from 'react-native';

import _ from 'lodash';

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
            return cb(null, userInfo);
        });
    }

    login(user, cb) {
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
    }

    logout(cb) {
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
    }
}

module.exports = new AuthService();
