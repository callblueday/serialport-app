import React, { Component } from 'react';
import Toolbar from '../toolbar/toolbar';
import LinkDialog from '../link-dialog/link-dialog';
import { comm } from '../../js/comm';
import { Emitter } from '../../js/emitter';
import './cmd-mode.scss';

class CmdMode extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let self = this;
    Emitter.on('ReceiveDataFromBle', function(data) {
      self.addMsg(data, 'back');
    });

  }

  componentWillUnmount() {

  }

  send (e) {
    let cmdType = document.querySelector('[name=cmdMode]:checked').value;
    let value = e.target.parentNode.querySelector('input').value;
    let cmd = null;

    var valueArray = value.split(" "), hexArray = [], decimalArray = [];
    if(cmdType == 'hex') {
      for(var i in valueArray) {
          if(valueArray[i]) {
              hexArray.push(parseInt(valueArray[i], 16).toString(16));
              decimalArray.push(parseInt(valueArray[i], 16));
          }
      }
      cmd = decimalArray;
    } else {
      cmd = value;
    }

    this.addMsg(cmd.toString());
    comm.send(cmd, cmdType);
  }

  sendTextArea (e) {
    let cmdType = document.querySelector('[name=cmdMode]:checked').value;
    let value = e.target.parentNode.querySelector('textarea').value;
    let cmd = null;

    var valueArray = value.split(" "), hexArray = [], decimalArray = [];
    if(cmdType == 'hex') {
      for(var i in valueArray) {
          if(valueArray[i]) {
              hexArray.push(parseInt(valueArray[i], 16).toString(16));
              decimalArray.push(parseInt(valueArray[i], 16));
          }
      }
      cmd = decimalArray;
    } else {
      cmd = value;
    }

    this.addMsg(cmd.toString());
    comm.send(cmd, cmdType);
  }

  addMsg (msgStr, type) {
    let className = 'cmd-item';
    if(type === 'back') {
      className = 'cmd-item-back';
    }
    var p = `<p class=${className}>${msgStr}</p>`;
    $('.msg').append(p);
    this.toBottom();
  }

  // 将滚动条始终置于页面底部
  toBottom () {
    var scrollOffset = $('.msg')[0].scrollHeight - $('.msg').height();
    $('.msg').animate({scrollTop: scrollOffset}, 0);
  }

  change (e) {

  }

  render () {
    return (
      <section className="box cmd-mode">
        <Toolbar />
        <div className="box-content cmd-content">
          <div className="msg">
          </div>

          <div className="opts">
            <form className="cmd-type">
              <label className="radio-inline">
                <input type="radio" name="cmdMode" id="" value="hex" /> HEX
              </label>
              <label className="radio-inline">
                <input type="radio" name="cmdMode" id="" value="acsii" checked onChange={this.change}/> ASCII
              </label>
            </form>

            <form className="form-inline ops">

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G01 A20 F2000" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              {/* device1*/}
              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G1 D1 S200" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G1 D1 S0" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G2 D1 A180 S50" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G2 D1 A0 S50" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              {/* device2*/}

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G1 D2 S200" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G1 D2 S0" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G2 D2 A180 S50" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" defaultValue="G2 D2 A0 S50" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

               <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                    <textarea type="text" defaultValue="G91 G01 A10 F800" className="form-control cmd-input"></textarea>
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.sendTextArea.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" placeholder="ff 55 03 00 01 00" defaultValue="ff 55 06 00 02 0a 09 ff 00" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" placeholder="ff 55 03 00 01 00" defaultValue="ff 55 06 00 02 0a 09 00 00" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>

              <div className="cmd-item">
                <div className="form-group col-xs-9 cmd">
                  <input type="text" className="form-control cmd-input" placeholder="G01 A10 B10 C10 D10 X10 F800" defaultValue="G01 A10 B10 C10 D10 X10 F800" />
                </div>
                <button type="button" className="btn btn-default col-xs-3 btn-send" onTouchStart={this.send.bind(this)}>Send</button>
              </div>
            </form>

            <div className="col-xs-12 menus">
              <button id="btn-cmd-add" className="btn fa fa-plus"></button>
            </div>
          </div>
        </div>
        <LinkDialog />
      </section>
    );
  }
}

export default CmdMode;
