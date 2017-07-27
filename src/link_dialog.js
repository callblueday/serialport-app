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
        console.log(device.name);
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

