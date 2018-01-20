import { Emitter } from './emitter';

/**
 * @fileOverview bluetooth communication.
 */

class Comm {
  constructor(props) {
    this.settings = {
      isConnected: false,

      // 服务 + 特征 = 功能 (mbot)
      // commServiceID: 'FFE1',
      // writeCharacteristicID: 'FFE3',
      // readCharacteristicID: 'FFE2'

      // cc2541：(anno)
      // commServiceID: 'FFE0',
      // writeCharacteristicID: 'FFE1',
      // readCharacteristicID: 'FFE1'

      // cc2540
      commServiceID: 'FFF0',
      writeCharacteristicID: 'FFF1',
      readCharacteristicID: 'FFF4'
    };
  }

  /**
   * Convert array of int to ArrayBuffer.
   * @param  {[int]} data array of int
   * @return {ArrayBuffer}      result array buffer
   * @private
   */
  arrayBufferFromArray (data) {
    var buffer = new ArrayBuffer(data.length);
    var result = new Int8Array(buffer);
    for (var i = 0; i < data.length; i++) {
      result[i] = data[i];
    }
    return buffer;
  }

  /**
   * Convert ArrayBuffer from array of int
   * @param  {ArrayBuffer} buffer the source arraybuffer
   * @return {[int]}        int array as the result;
   * @private
   */
  arrayFromArrayBuffer (buffer) {
    var dataView = new Uint8Array(buffer);
    var result = [];
    for (var i = 0; i < dataView.length; i++) {
      result.push(dataView[i]);
    }
    return result;
  }

  // ASCII only
  stringToBytes (string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  stringToAsciiCode (string) {
    var result = [];
    var list = string.split('');
    for (var i in list) {
        result.push(list[i].charCodeAt());
    }
    return result;
  }

  // ASCII only
  bytesToString (buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  receiveData () {
    var self = this;
    if(typeof ble != 'undefined') {

      if (ble && ble.connectedDeviceID) {
        ble.startNotification(ble.connectedDeviceID, self.settings.commServiceID, self.settings.readCharacteristicID, function(data) {
          // read success
          let result = data;
          if(typeof data == 'object') {
            // result = self.arrayFromArrayBuffer(data).join(" ");
            result = self.bytesToString(data);
          }
          console.log(result);
          Emitter.emit('ReceiveDataFromBle', result);
        }, function(err) {
          // read failure
          console.log('read error, ', err);
        });
      } else {
        // connection may lost
      }
    }
  }

  send (buf, type) {
    var self = this;
    var cmdType = type ? type : "ascii";
    var cmd = buf;
    if(cmdType != "hex") {
      console.log(cmd);
      var temp = self.stringToAsciiCode(cmd).concat([10]);  // 加上回车符号
      cmd = self.arrayBufferFromArray(temp);
    } else {
      console.log(cmd.join(", "));
      cmd = self.arrayBufferFromArray(buf);
    }

    if(typeof ble != 'undefined') {
      if (ble && ble.connectedDeviceID) {
        ble.writeWithoutResponse(ble.connectedDeviceID, self.settings.commServiceID,
          self.settings.writeCharacteristicID, cmd,
          function() {
            console.log('send success');
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

  disconnect () {
    if (ble && ble.connectedDeviceID) {
      ble.disconnect(connectedDeviceID, function () {
        console.log('disconnect success');
        Emitter.emit('DisconnectSuccess', "");
      }, function () {
        console.log('disconnect failure');
      });
    }
  }
}


export const comm = new Comm();
