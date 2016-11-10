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
    ORDER_READY: null,
});

const DisplayMessages = {
	IN_RANGE: 'Find me a table',
	EATING: 'Enjoy your meal'
};

export { UserStates as default, DisplayMessages };
