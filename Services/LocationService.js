import UserStates from '../Constants/UserStates';

class LocationService {
    static isYetToOrder(userstate) {
        return (userstate === UserStates.AWAY
            || userstate === UserStates.IN_RANGE);
    }

    static isAway(userstate) {
        return (userstate === UserStates.AWAY);
    }

    static isInRange(userstate) {
        return (userstate === UserStates.IN_RANGE);
    }

    static isInsideFoodcourt(userstate) {
        return (userstate !== UserStates.AWAY);
    }

    static isSeatedAtTable(userstate) {
        return (userstate === UserStates.SEATED);
    }
}

export { LocationService as default };
