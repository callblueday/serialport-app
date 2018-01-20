import React, { Component } from 'react';
import Toolbar from '../toolbar/toolbar';
import { action } from '../servo-editor/js/action';
import './style.scss';

class ServoControl extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {

  }

  init () {

  }

  move (type) {
    action.move(type);
  }

  setLed (type) {
    action.setLed(type);
  }

  setAction (type) {
    action.setAction(type);
  }

  render () {
    return (
      <section className="box control-mode servo-control">
        <Toolbar />
        <div className="topbar">
          <h3>舵机控制</h3>
        </div>
        <div className="box-content control-content servo-control">
            <div className="joystick">
              <table>
                <tr>
                  <td><button type="button" className="btn btn-success" onClick={this.setLed.bind(this, 'f')}>蓝灯</button></td>
                  <td><button type="button" className="btn btn-success" onClick={this.setLed.bind(this, 'g')}>绿灯</button></td>
                  <td><button type="button" className="btn btn-success" onClick={this.setLed.bind(this, 'h')}>关灯</button></td>
                </tr>
                <tr>
                  <td><button type="button" className="btn btn-success green" onClick={this.setAction.bind(this, '6')}>左转</button></td>
                  <td><button type="button" className="btn btn-success blue" onClick={this.setAction.bind(this, '2')}>向前</button></td>
                  <td><button type="button" className="btn btn-success green" onClick={this.setAction.bind(this, '7')}>右转</button></td>
                </tr>
                <tr>
                  <td><button type="button" className="btn btn-success blue" onClick={this.setAction.bind(this, '4')}>向左</button></td>
                  <td><button type="button" className="btn btn-success blue" onClick={this.setAction.bind(this, '3')}>向后</button></td>
                  <td><button type="button" className="btn btn-success blue" onClick={this.setAction.bind(this, '5')}>向右</button></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </table>
            </div>

            <div className="other-opts">
              <button type="button" className="btn btn-primary orange" onClick={this.setAction.bind(this, '1')}>启动状态</button>
              <button type="button" className="btn btn-primary orange" onClick={this.setAction.bind(this, '9')}>打招呼</button>
              <button type="button" className="btn btn-primary yellow" onClick={this.setAction.bind(this, 'b')}>俯卧撑</button>
              <button type="button" className="btn btn-primary yellow" onClick={this.setAction.bind(this, '8')}>站立</button> <br />
              <button type="button" className="btn btn-primary lightred" onClick={this.setAction.bind(this, 'a')}>战斗模式</button>
              <button type="button" className="btn btn-primary lightred" onClick={this.setAction.bind(this, 'c')}>休息</button>
            </div>

        </div>
      </section>
    );
  }
}

export default ServoControl;
