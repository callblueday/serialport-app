(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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
},{"./parse":6}],3:[function(require,module,exports){
var Input = require("./input_events");
var LinkDialog = require("./link_dialog");
var HostInterface = require("./hostInterface");
var Utils = require("./utils");


var linkDialog = new LinkDialog();
linkDialog.onConnect = function(){
    // TODO: after bluetooth connected, dosomething
};


$('#link-button').on(Input.end, function(e){
    linkDialog.open();
    e.preventDefault();
});

$('#btn-cmd-add').on(Input.end, function(e){
    var item = '<div class="cmd-item">' +
                    '<div class="form-group col-xs-9 cmd">' +
                        '<input type="text" class="form-control cmd-input" placeholder="ff 55 03 10 00 11 12 13">' +
                    '</div>' +
                    '<button type="button" class="btn btn-default col-xs-3 btn-send">Send</button>' +
                '</div>';
    $('.form-inline').append(item);
});


$('.form-inline').on(Input.end, '.cmd-item .btn-send', function(e){
    console.log(1)
    var value = $(this).parent().find(".cmd-input").val();
    if(value.length) {
        // send serial data
        var valueArray = value.split(" "), hexArray = [], decimalArray = [];

        if($('[name=cmdMode]:checked').val() == "hex") {
            for(var i in valueArray) {
                if(valueArray[i]) {
                    hexArray.push(parseInt(valueArray[i], 16).toString(16));
                    decimalArray.push(parseInt(valueArray[i], 16));
                }
            }
            Utils.addMsg(hexArray.join(" "));
            HostInterface.sendBluetoothRequest(decimalArray);
        } else {
            Utils.addMsg(value);
            HostInterface.sendBluetoothRequest(value, 'ascii');
        }
    }
});
},{"./hostInterface":2,"./input_events":4,"./link_dialog":5,"./utils":7}],4:[function(require,module,exports){
var InputEvent = {
  start: "mousedown",
  move: "mousemove",
  end: "mouseup",
  clientX: function(e) { return e.clientX; },
  clientY: function(e) { return e.clientY; }
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  var InputEvent = {
    start: "touchstart",
    move: "touchmove",
    end: "touchend",
    clientX: function(e) { return e.changedTouches[0].clientX; },
    clientY: function(e) { return e.changedTouches[0].clientY; }
  }
}


window.Input = InputEvent;

module.exports = InputEvent;

},{}],5:[function(require,module,exports){
var Input = require('./input_events');
var HostInterface = require('./hostInterface');

function LinkDialog() {
  var self = this;
  self.isOpen = false;
  self.onConnect = null;
  self.deviceId = null;
  self.modal = new tingle.modal({
    cssClass: ['link-dialog'],
    onOpen: function(){
      self.isOpen = true;
    },
    onClose: function(){
      self.isOpen = false;
      if(typeof ble != "undefined"){
        ble.stopScan();
      }
    }
  });
  self.modal.setContent(document.getElementById('dialogContent').innerHTML);

  this.startScan = function(){
    if(typeof ble != "undefined"){
      ble.startScan([], function(device){
        // if(!device.name || device.name.indexOf('Makeblock') == -1){
        //   return;
        // }
        var distance = Math.pow(10.0,((Math.abs(parseInt(device.rssi))-50.0)/50.0))*0.7;
        var li = document.createElement('li');
        li.innerHTML = device.name+'<span class="distance">'+distance.toFixed(1)+' m</span>';
        li.distance = distance;
        li.deviceId = device.id;
        // insert discovered device in distance order
        var insertBeforeNode = null;
        var lis = self.listElement.children;
        for(var i=0;i<lis.length;i++) {
          if(lis[i].distance > distance){
            insertBeforeNode = lis[i];
            break;
          }
        }
        self.listElement.insertBefore(li, insertBeforeNode);


        li.addEventListener(Input.end, function(){
          // link to the device
          ble.stopScan();
          self.deviceId = this.deviceId;
          ble.connect(this.deviceId, function(){  // connect success
            console.log('connect success');
            self.modal.close();
            if(self.onConnect) {
              ble.connectedDeviceID = self.deviceId;
              self.onConnect();
              HostInterface.receiveData();
            }
          }, function(){  // connect failure
            console.log('connect failure');
            if(!self.isOpen) {
              self.open();
            }
            else{
              self.startScan();
            }
          });
        });
      }); // start scan
    } // if ble
  } // start scan

  this.open = function(){
    self.modal.open();
    var el = document.querySelector('.link-dialog');
    self.listElement = el.querySelector('.connectList');
    // self.listElement.innerHTML = '<li><span class="mac_address">4588D39F3FF3FSFEG</span><span class="distance">0.8 m</span></li>';

    el.querySelector('.connect-dialog-close').addEventListener(Input.end, function(){
      self.modal.close();
    });
    el.querySelector('.connect-dialog-refresh').addEventListener(Input.end, function(){
      // refresh search
      self.listElement.innerHTML = "";
      if(ble){
        ble.stopScan();
        self.startScan();
      }
    });

    self.startScan();
  }
}

window.LinkDialog = LinkDialog;

module.exports = LinkDialog;


},{"./hostInterface":2,"./input_events":4}],6:[function(require,module,exports){
var Utils = require("./utils");

var Parse = {
    doParse: function(bufArray) {
        console.log(data);
        Utils.addMsg(bufArray.toString());
    }
};

module.exports = Parse;
},{"./utils":7}],7:[function(require,module,exports){
var Utils = {
    // 将信息贴在图形框中
    addMsg: function(msgStr) {
        var p = msgStr + "<br/>";
        $('.msg').append(p);
        this.toBottom();
    },
    // 将滚动条始终置于页面底部
    toBottom: function() {
        var scrollOffset = $('.msg')[0].scrollHeight - $('.msg').height();
        $('.msg').animate({scrollTop: scrollOffset}, 0);
    }
};

module.exports = Utils;
},{}]},{},[1,2,3,4,5,6,7]);
