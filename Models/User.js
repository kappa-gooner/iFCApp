import UserStates from '../Constants/UserStates';

class User {
    constructor(username, usertype, state = UserStates.AWAY, table = -1) {
        this.user = username;
        this.userType = usertype;
        this.state = state;
        this.table = table;
    }
}

export { User as default };
