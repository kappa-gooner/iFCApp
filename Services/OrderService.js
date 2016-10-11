import { createStore } from 'redux';

import UserStates from '../Constants/UserStates';
import DBService from './DBService';
import Order from '../Models/Order';
import DB from '../Constants/DBConstants';

const defaultState = {
    order: {},
    state: UserStates.AWAY,
    table: -1,
    user: '',
};

function updateOrderTable(orderInfo, newstate) {
    try {
        // Update user info here
        const orderData = orderInfo;
        orderData.state = newstate;

        DBService.getDB().ref(DB.ordersTable + orderData.table).set({
            order: orderData,
        }).then(() => {
            console.log('Order Table updated successfully!');
        })
        .catch((err) => {
            // Handle errors here
        });
    } catch (error) {
          // Error saving data
    }
}

function orderService(state = defaultState, action) {
    switch (action.type) {
    case UserStates.ORDER_PENDING: {
        const orderInfo = action.order;
        updateOrderTable(orderInfo, action.type);
        return Object.assign({}, state, new Order(
            orderInfo.order,
            action.type,
            orderInfo.table,
            orderInfo.user,
        ));
    }
    case UserStates.ORDER_READY: {
        const table = action.order.table;
        DBService.getDB().ref(DB.ordersTable + table).set(null).then(() => {
            console.log('Order Table updated successfully!');
        })
        .catch((err) => {
            // Handle errors here
        });
        // Irrelevant
        return Object.assign({}, state, action.order);
    }
    default:
        return Object.assign({}, state, action.order);
    }
}

export default createStore(orderService);
