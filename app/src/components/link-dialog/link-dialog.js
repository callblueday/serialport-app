import React, { Component } from 'react';
import { connect } from 'react-redux';
import './link-dialog.scss';
import ReactModal from 'react-modal';
import { comm } from '../../js/comm';
import { Emitter } from '../../js/emitter';

const {
    openLinkDialog,
    closeLinkDialog,
    toggleLinkDialog
} = require('../../reducers/interface');

const {
    bleConnected,
    bleDisconnect
} = require('../../reducers/ble');

class LinkDialog extends Component {

  constructor(props) {
    super(props);
    this.deviceId = null;

    this.state = {
      bleDeviceList: [
        // {
        //   "name": "4588D39F3FF3FSFEG1",
        //   "distance": 0.1,
        //   "id": 1
        // },
        // {
        //   "name": "4588D39F3FF3FSFEG2",
        //   "distance": 0.2,
        //   "id": 2
        // },
        // {
        //   "name": "4588D39F3FF3FSFEG3",
        //   "distance": 0.3,
        //   "id": 3
        // }
      ]
    }
  }

  componentDidMount() {
    this.startScan();
  }

  componentWillUnmount() {

  }

  refresh () {
    if(typeof ble !== 'undefined'){
      ble.stopScan();
    }
    this.startScan();
  }

  startScan () {
    let self = this;
    this.setState({ bleDeviceList: [] });
    if(typeof ble != 'undefined'){
      ble.startScan([], function(device){
        var distance = Math.pow(10.0,((Math.abs(parseInt(device.rssi))-50.0)/50.0))*0.7;
        self.addDevice(device.name, distance, device.id);
      });
    }
  }

  addDevice (deviceName, distance, id) {
    deviceName = deviceName || new Date().getTime().toString();
    distance = distance || Math.random(10);
    id = id || '1234';

    let item = {
      name: deviceName,
      distance: distance.toFixed(2),
      id: id
    };
    this.state.bleDeviceList.push(item);
    this.setState({
      bleDeviceList: this.state.bleDeviceList
    });
  }

  open () {
    this.props.open();
    this.startScan();
  }

  close () {
    this.props.close();
  }

  disconnect(deviceId) {
    if(typeof ble !== 'undefined'){
      ble.disconnect(deviceId, function () {
        console.log('discnnect success!');
      }, function () {
        console.log('discnnect failure!');
      });
    }
  }

  // connect to the device
  connect (deviceId, e) {
    let self = this;
    console.log(deviceId);
    if(typeof ble === 'undefined'){
      self.close();
      return;
    }

    if(self.deviceId && deviceId != self.deviceId) {
      self.disconnect(deviceId);
    }

    ble.stopScan();
    self.deviceId = deviceId;
    ble.connect(self.deviceId, function () {  // connect success
      console.log('connect success');
      ble.connectedDeviceID = self.deviceId;
      comm.receiveData();
      self.close();

      Emitter.emit('connectSuccess', "");

      e.persist();
    }, function(){  // connect failure
      console.log('connect failure');
      if(!self.props.dialogVisible) {
        // 弹出蓝牙界面
        self.open();
      }
    });
  }

  render () {
    let that = this;

    const {
      close,
      ...props
    } = this.props;

    this.bleDeviceList = this.state.bleDeviceList.sort(function(a,b) {
      return a.distance - b.distance;
    });

    return (
      <ReactModal
         isOpen={this.props.dialogVisible}
         contentLabel="onRequestClose Example"
         className="Modal"
         overlayClassName="Overlay"
      >
        <div className="dialogHeader">
            <i className="fa fa-bluetooth"></i>
            <div className="headerRight">
                <i className="fa fa-refresh connect-dialog-refresh" onTouchStart={this.refresh.bind(this)}></i>
                <i className="fa fa-times connect-dialog-close" onTouchStart={close}></i>
            </div>
        </div>
        <ul className="connectList">
          {
            this.bleDeviceList.map((item, idx) => {
              if(item) {
                return <li key={item.name} onTouchStart={this.connect.bind(this, item.id)}><span className="mac_address">{item.name}</span><span className="distance">{item.distance} m</span></li>
              }
            })
          }
        </ul>
      </ReactModal>
    );
  }
}

const mapStateToProps = state => ({
  dialogVisible: state.interface.dialogVisible,
  bleConnected: state.ble.bleConnected,
});

const mapDispatchToProps = (dispatch) => ({
  close: (e) => {
    Emitter.emit('connectSuccess', "");
    e && e.preventDefault();
    dispatch(closeLinkDialog())
  },

  open: (e) => {
    dispatch(openLinkDialog())
  },

  bleConnect: (e) => {
    dispatch(bleConnected())
  },

  bleDisconnect: (e) => {
    dispatch(bleDisconnect())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinkDialog);
