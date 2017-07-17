var parse = require("./parse");

var HostInterface = {

  settings: {
    isConnected: false,
    commServiceID: 'FFE1',
    writeCharacteristicID: 'FFE3',
    readCharacteristicID: 'FFE2'
  },

  /**
   * Convert array of int to ArrayBuffer.
   * @param  {[int]} data array of int
   * @return {ArrayBuffer}      result array buffer
   * @private
   */
  arrayBufferFromArray: function(data) {
    var buffer = new ArrayBuffer(data.length);
    var result = new Int8Array(buffer);
    for (var i = 0; i < data.length; i++) {
      result[i] = data[i];
    }
    return buffer;
  },

  /**
   * Convert ArrayBuffer from array of int
   * @param  {ArrayBuffer} buffer the source arraybuffer
   * @return {[int]}        int array as the result;
   * @private
   */
  arrayFromArrayBuffer: function(buffer) {
    var dataView = new Uint8Array(buffer);
    var result = [];
    for (var i = 0; i < dataView.length; i++) {
      result.push(dataView[i]);
    }
    return result;
  },

  receiveData: function() {
    var self = this;
    if(typeof ble != "undefined") {

      if (ble && ble.connectedDeviceID) {
        ble.startNotification(ble.connectedDeviceID, self.settings.commServiceID, self.settings.readCharacteristicID, function(data) {
          var bufArray = self.arrayFromArrayBuffer(data);
          // read success
          parse.doParse(bufArray);

        }, function(err) {
          // read failure
          console.log('read error, ', err);
        });
      } else {
        // connection may lost
      }
    }
  },

  sendBluetoothRequest: function(buf, type) {
      var self = this;
      var cmdType = type ? type : "hex";
      var cmd = buf;
      if(cmdType == "hex") {
        console.log(buf.join(", "));
        cmd = self.arrayBufferFromArray(buf);
      } else {
        console.log(cmd);
      }

      if(typeof ble != "undefined") {
        if (ble && ble.connectedDeviceID) {
          ble.writeWithoutResponse(ble.connectedDeviceID, self.settings.commServiceID,
            self.settings.writeCharacteristicID, cmd,
            function() {
              if (!self.isConnected) {
                self.receiveData();
              }
              self.isConnected = true;
            },
            function(err) {
              console.log('write error, ', err);
              ble.stopNotification(ble.connectedDeviceID, self.settings.commServiceID, self.settings.readCharacteristicID);
              self.isConnected = false;
            }
          );
        }
      }
  }
};


module.exports = HostInterface;