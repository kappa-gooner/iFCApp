import KeyMirror from 'keymirror';

const UserStates = KeyMirror({
    AWAY: null,
    IN_RANGE: null,
    SEATED: null,
    ORDERED: null,
    EATING: null,
    EATING_DONE: null,

    // Vendor specific
    ORDER_PENDING: null,
});

export { UserStates as default };
