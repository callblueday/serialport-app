const BLUETOOTH_CONNECTED = 'bluetooth_connected';
const BLUETOOTH_DISCONNECTED = 'bluetooth_disconnected';
const BLUETOOTH_RECEIVED = 'bluetooth_received';

const initialState = {
  "bleConnected": false,
  "message": ""
};

const bluetooth = function (state = initialState, action) {
  switch (action.type) {
    case BLUETOOTH_CONNECTED:
      return Object.assign({}, state, {
        bleConnected: true
      });
    case BLUETOOTH_DISCONNECTED:
      return Object.assign({}, state, {
        bleConnected: false
      });
    case BLUETOOTH_RECEIVED:
      return Object.assign({}, state, {
        message: action.message
      });
    default:
      return state;
  }
};

bluetooth.bleConnected = function (status) {
    return {
        type: BLUETOOTH_CONNECTED,
        status: status
    }
};

bluetooth.bleDisconnect = function (status) {
    return {
        type: BLUETOOTH_DISCONNECTED,
        status: status
    }
};

bluetooth.bleReceive = function (message) {
    return {
        type: BLUETOOTH_DISCONNECTED,
        message: message
    }
};

module.exports = bluetooth;