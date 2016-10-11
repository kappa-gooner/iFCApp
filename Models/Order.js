import UserStates from '../Constants/UserStates';

class Order {
    constructor(orderItem, state = UserStates.ORDER_PENDING, table = -1, username = '') {
        this.order = orderItem;
        this.state = state;
        this.table = table;
        this.user = username;
    }
}

export { Order as default };
