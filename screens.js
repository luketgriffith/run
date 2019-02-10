const React = require('react');
const { Navigation } = require('react-native-navigation');
const Home = require('./pages/home');
const Login = require('./pages/login');
const Runs = require('./pages/runs');
const Splash = require('./pages/splash');

function registerScreens() {
  Navigation.registerComponent(`home`, () => Home);
  Navigation.registerComponent(`login`, () => Login);
  Navigation.registerComponent(`runs`, () => Runs);
  Navigation.registerComponent(`splash`, () => Splash);
}

module.exports = {
  registerScreens
};
