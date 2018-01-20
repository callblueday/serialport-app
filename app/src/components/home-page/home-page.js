import React, {Component} from 'react';
import StorySlider from '../story-slider/story-slider';
import { connect } from 'react-redux';
import Toolbar from '../toolbar/toolbar';
import LinkDialog from '../link-dialog/link-dialog';
import './home-page.scss';

const appList = [
  {
    "text": "调试模式",
    "name": "cmdMode"
  },
  {
    "text": "舵机控制",
    "name": "servoControl"
  },
  {
    "text": "舵机编辑器",
    "name": "servoEditor"
  },
  {
    "text": "编程模式",
    "name": "codeMode"
  }
]

class HomePage extends Component {
  render() {
    return (
      <section className="app-body">
        <Toolbar />
        <StorySlider list={appList} />
        <LinkDialog />
      </section>
    )
  }

}


const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps)(HomePage);
