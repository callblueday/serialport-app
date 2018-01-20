const {combineReducers} = require('redux');

module.exports = combineReducers({
    interface: require('./interface'),
    ble: require('./ble'),
    code: require('./code'),
});
