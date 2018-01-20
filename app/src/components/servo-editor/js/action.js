import { comm } from '../../../js/comm';
var request = require('request');


class Action {
  constructor(props) {
    this.url = 'http://192.168.4.1/controller';
  }

  doRequest (hash) {
    console.log(hash);
    let url = this.url + `?${hash}`;
    request(url, function (error, response, body) {
      // console.log('statusCode:', response && response.statusCode);
    });
  }

  doBleRequest (cmd) {
    comm.send(cmd);
  }

  move (type) {
    let hash = `pm=${type}`;
    this.doRequest(hash);
  }

  // 转动舵机到指定角度
  moveToAngle (id, value) {
    let hash = `servo=${id}&value=${value}`;
    this.doRequest(hash);
  }

  // 将舵机的初始角度存在主板的 flash 空间中
  saveAngleToFlash (id, value) {
    let hash = `setting=${id}&value=${value}`;
    this.doRequest(hash);
  }

  // 让所有舵机回到初始位置
  initServos () {
    let hash = `pm=100`;
    this.doRequest(hash);
  }

  // 清空EEPROM中所有存储的舵机角度值
  clearFlash () {
    let hash = `pm=999`;
    this.doRequest(hash);
  }

  /**
   * --------------
   * bluetooth
   * --------------
   */

  setLed (type) {
    this.doBleRequest(type);
  }

  // 设置动作组
  setAction (type) {
    this.doBleRequest(type);
  }
}

export const action = new Action();
