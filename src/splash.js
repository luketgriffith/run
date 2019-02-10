import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';

class Splash extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  state = {
    authed: false
  }

  componentDidAppear() {
    this.listener = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        console.log('got us a user here.....')
        this.authed()
      } else {
        console.log('no user sir')
        this.notAuthed()
      }
    })
  }

  componentDidDisappear() {
    console.log('leaving splash...')
    // this.listener();
  }

  authed = () => {
    if (this.state.authed) return
    // prevents the nav command from being fired twice
    this.setState({ authed: true }, () => {
      Navigation.push(this.props.componentId, {
        component: {
          name: 'home',
          options: {}
        }
      });
    })
  }

  notAuthed = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'login',
        options: {}
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
