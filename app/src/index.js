import React, { Component } from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import reducers from './reducers/gui';

import HomePage from './components/home-page/home-page';
import CodeMode from './components/code-mode/code-mode';
import CmdMode from './components/cmd-mode/cmd-mode';
import ServoEditor from './components/servo-editor/servo-editor';
import ServoControl from './components/servo-control';
import App from './js/app';

const store = createStore(reducers);

render(
  <Provider store={ store }>
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/homePage" exact component={HomePage} />
        <Route path="/cmdMode" exact component={CmdMode} />
        <Route path="/codeMode" exact component={CodeMode} />
        <Route path="/servoEditor" exact component={ServoEditor} />
        <Route path="/servoControl" exact component={ServoControl} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('app')
)
