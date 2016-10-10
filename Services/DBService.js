import * as firebase from 'firebase';
import AuthConfig from '../Config/AuthConfig';

const config = {
    apiKey: AuthConfig.apiKey,
    authDomain: AuthConfig.authDomain,
    databaseURL: AuthConfig.databaseURL,
    storageBucket: AuthConfig.storageBucket,
    messagingSenderId: AuthConfig.messagingSenderId,
};

let firebaseApp;

class DBService {
    static initialize() {
        firebaseApp = firebase.initializeApp(config);
    }

    static getDB() {
        return firebaseApp.database();
    }
}

export { DBService as default };
