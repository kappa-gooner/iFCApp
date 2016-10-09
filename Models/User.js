import UserStates from '../Constants/UserStates';

class User {
    constructor(username, usertype) {
        this.user = username;
        this.userType = usertype;
        this.state = UserStates.AWAY;
        this.table = -1;
    }
}

export { User as default };
