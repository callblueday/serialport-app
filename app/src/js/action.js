import { comm } from './comm';

const angleRange = {
  "J1": [-180, 180],
  "J2": [-120, 120],
  "J3": [-120, 120],
  "J4": [-180, 180],
  "J5": [-180, 180],
  "J6": [0, 120]
};

class Action {
  constructor(props) {

  }

  // 初始化
  start () {
    comm.send('G2');
  }

  resetAllAxis () {
    comm.send('G00 A0 B0 C0 D0 X0 Y0 Z');
  }

  // 进入遥感模式
  enterJoystickMode () {
    comm.send('M93');
  }

  exitJoystickMode () {
    comm.send('M94');
  }

  // 退出遥感模式

  setRelativeMove () {
    comm.send('G91');
  }

  setAbsoluteMove () {
    comm.send('G90');
  }

  // 相对单轴运动
  move (axis, angle, speed) {
    speed = (speed > 2000) ? 2000 : speed;
    angle = parseInt(angle);
    speed = parseInt(speed);
    var cmd = 'G01 ' + axis + angle + ' F' + speed;
    comm.send(cmd);
  }

  // 多轴联动控制
  moveAllAxis (as, bs, cs, ds, xs, ys, speed) {
    var cmd = 'G01 A' + as + ' B' + bs + ' C' + cs + ' D' + ds + ' X' + xs + ' Y' + ys + ' F' + speed;
    comm.send(cmd);
  }

  moveFree (cmdStr) {
    comm.send(cmdStr);
  }

  // 双轴联动
  moveTwoAxis(ax, aAngle, bx, bAngle, speed) {
    var cmd = 'G01 ' + ax + parseInt(aAngle) + ' ' + bx + parseInt(bAngle) + ' F' + parseInt(speed);
    comm.send(cmd);
  }

  // 设置固件模式
  setMode (mode) {
    let modeMaps = {
      "paishe-open": "M10",
      "paishe-close": "M11",
      "penqi-open": "M10",
      "penqi-close": "M11",
      "jiaqu-open": "M10",
      "jiaqu-close": "M11",
      "xiqu-open": "M10",
      "xiqu-close": "M11",
      "hanjie-open": "M10",
      "hanjie-close": "M11"
    };
    comm.send(modeMaps[mode]);
  }
}

export const action = new Action();
