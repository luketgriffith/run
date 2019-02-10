import { Navigation } from 'react-native-navigation';
import Splash from './splash';
import Home from './home';
import Login from './login';
import Runs from './runs';
import SingleRun from './singleRun';

export const registerScreens = function () {
  Navigation.registerComponent(`home`, () => Home);
  Navigation.registerComponent(`login`, () => Login);
  Navigation.registerComponent(`runs`, () => Runs);
  Navigation.registerComponent(`splash`, () => Splash);
  Navigation.registerComponent('singleRun', () => SingleRun);
}
