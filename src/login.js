import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';

export default class Login extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  state = {
    email: '',
    pw: ''
  }

  componentDidAppear() {
    this.listener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('got us a user here.....')
        this.authed()
      }
    })
  }

  componentDidDisappear() {
    console.log('leaving...')
    this.listener();
  }

  authed = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'home',
        options: {}
      }
    });
  }

  onChange = (email) => {
    this.setState({ email })
  }

  onChangePw = (pw) => {
    this.setState({ pw })
  }

  submit = async () => {
    console.log('whee..')
    let { email, pw } = this.state;
    // let actionCodeSettings = {
    //   url: 'https://walkskipper.com',
    //   handleCodeInApp: true, // must always be true for sendSignInLinkToEmail
    //   iOS: {
    //     bundleId: 'com.luketgriffith.run',
    //   }
    // }
    await firebase.auth().signInWithEmailAndPassword(email, pw).catch(async e => {
      console.log('eeeee', e.code)
      if (e && e.code === 'auth/user-not-found') {
        await firebase.auth().createUserWithEmailAndPassword(email, pw).catch(e => {
          console.log('bork bork...', e)
        })
      } else {
        Alert.alert('Error: ' + e.message)
      }
      // if (e.message)
    })
  }

  renderLogIn = () => {
    return (
      <View>
        <TextInput
          value={this.state.email}
          placeholder="email"
          onChangeText={this.onChange}
        />
        <TextInput
          value={this.state.pw}
          placeholder="password"
          onChangeText={this.onChangePw}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={this.submit}>
          <Text>Login/Register</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.renderLogIn()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wat: {

  },
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
