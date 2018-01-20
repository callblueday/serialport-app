import React, { Component } from 'react';
import Runtime from '../js/runtime';
import './run-button.scss';

const TEXT_RUN = "RUN";
const TEXT_STOP = "STOP";

class RunButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRunning: false
    }

    this.targetTopBlocks = ['when_start', 'procedures_defnoreturn'];
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  clickBtn () {
    if(this.state.isRunning) {
      this.stopRun();
    } else {
      this.runCodes();
    }
  }

  stopRun() {
    this.runtime.stop();
    this.setState({isRunning: false});
  }

  runCodes () {
    let self = this;
    this.runtime = new Runtime();
    this.runtime.callback = function () {
      self.setState({isRunning: false});
    }

    this.setState({isRunning: true});
    let codes = this.getCodes();
    this.runtime.doInterpreter(codes);
  }

  getCodes () {
    let topBlocks = Blockly.mainWorkspace.getTopBlocks();
    let codes = "";
    for (let item of topBlocks) {
      if(item) {
        // 存储指定代码块下的代码
        if (this.targetTopBlocks.indexOf(item.type) !== -1) {
          codes += Runtime.parseCode(item);
        }
      }
    }
    return codes;
  }

  render() {
    let isRunning = this.state.isRunning;
    return (
      <button className={isRunning ? 'run-btn running' : 'run-btn'} onTouchStart={this.clickBtn.bind(this)}>
        {
          isRunning ? TEXT_STOP : TEXT_RUN
        }
      </button>
    );
  }
}

export default RunButton;
