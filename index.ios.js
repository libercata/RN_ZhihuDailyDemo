/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';

import Home from './js/home';

export default class RN_ZhihuDailyDemo extends Component {
  render() {
    return (
      <Home />
    );
  }
}

AppRegistry.registerComponent('RN_ZhihuDailyDemo', () => RN_ZhihuDailyDemo);
