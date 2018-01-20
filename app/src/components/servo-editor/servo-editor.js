import React, { Component } from 'react';
import Toolbar from '../toolbar/toolbar';
import LinkDialog from '../link-dialog/link-dialog';
import { action } from './js/action';
import noUiSlider from 'nouislider';
import wNumb from './js/wNumb';
import './servo-editor.scss';

// 角度范围
const ANGLE_RANGE = [1, 180];

// 两次指令间发送的时间间隔，单位毫秒
const CMD_INTERVAL = 300;

class ServoEditor extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.servoIdList = [0, 1, 2, 3, 4, 5, 6, 7];
    this.initAngles = {
      "0": 90,
      "1": 90,
      "2": 90,
      "3": 90,
      "4": 90,
      "5": 90,
      "6": 90,
      "7": 90
    };

    window.servoAngleMaps = this.servoAngleMaps = {};
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {

  }

  init () {
    // craete sliders
    this.createSliderList(this.servoIdList);
    this.craeteServoAngleMaps();
  }

  craeteServoAngleMaps () {
    for (let item of this.servoIdList) {
      this.servoAngleMaps[item] = {};
      this.servoAngleMaps[item].angle = this.initAngles[item];
    }
  }

  onSliderChange (sliderName, value) {
    let curTime = new Date().getTime();
    if(!this.preTime) {
      this.preTime = curTime;
    }

    // 小于预设的时间间隔，丢掉数据
    if (curTime - this.preTime < CMD_INTERVAL) {
      return;
    }

    let id = parseInt(sliderName.split('-')[1]);
    let angle = parseInt(value[0]);
    this.servoAngleMaps[id].angle = angle;
    action.moveToAngle(id, angle);
  }

  createSliderList (sliderIdList) {
    for (let item of sliderIdList) {
      let eleId = 'id-' + item;
      this.createSlider(eleId, ANGLE_RANGE);
    }
  }

  createSlider (eleId, range, orientation) {
    let that = this;
    let id = eleId.split('-')[1];
    let slider = document.getElementById(eleId);
    range = range ? range : ANGLE_RANGE;
    orientation = orientation ? orientation : 'vertical';
    noUiSlider.create(slider, {
      start: that.initAngles[id],
      connect: [true, false],
      direction: 'rtl',
      tooltips: [true],
      orientation: orientation,
      behaviour: 'tap',
      range: {
        'min': range[0],
        'max': range[1]
      },
      animate: true,
      animationDuration: 300,
      format: wNumb({
        decimals: 0 // 小数点的位数
      }),
      // pips: {
      //   mode: 'values',
      //   values: range,
      //   density: 7
      // }
    });

    let idText = document.createElement("span");
    idText.innerText = eleId.split('-')[1];
    slider.querySelector('.noUi-handle').appendChild(idText);

    slider.noUiSlider.on('slide', this.onSliderChange.bind(this, eleId));

    return slider.noUiSlider;
  }

  initServos () {
    action.initServos();
    // 改变页面 UI 滑块也回到初始位置
  }

  setToZero () {
    let that = this;
    let isSure = confirm("确认存储所有当前位置为初始位置？")
    if (isSure) {
      for (let i = 0; i < this.servoIdList.length; i++) {
        let id = parseInt(that.servoIdList[i]);
        let value = parseInt(that.servoAngleMaps[id].angle) - that.initAngles[id.toString()];
        action.saveAngleToFlash(id, value);
      }
    }
  }

  render () {
    let servos = this.servoIdList.concat();
    let servoGroup1 = servos.splice(0,4);
    let servoGroup2 = servos;
    return (
      <section className="box control-mode servo-editor">
        <Toolbar />
        <div className="topbar">
          <h3>舵机调试</h3>
        </div>
        <div className="box-content control-content">
          <div className="wrapper opts-wrapper">
            <div className="item">
              <button type="button" className="btn btn-primary" onClick={this.initServos.bind(this)}>回到初始位置</button>
              {/*<button type="button" className="btn btn-primary" onClick={this.setToZero.bind(this)}>存储当前位置为初始值</button>*/}
            </div>
          </div>

          <div className="wrapper slider-wrapper">
            <div className="slider-box angle">
              {
                servoGroup1.map((item, idx) => {
                  let id = 'id-' + item;
                  if(item || item === 0) {
                    return <div key={id} className="slider" id={id}></div>
                  }
                })
              }
            </div>
            <div className="slider-box angle">
              {
                servoGroup2.map((item, idx) => {
                  let id2 = 'id-' + item;
                  if(item || item === 0) {
                    return <div key={id2} className="slider" id={id2}></div>
                  }
                })
              }
            </div>
          </div>

        </div>
        <LinkDialog />
      </section>
    );
  }
}

export default ServoEditor;
