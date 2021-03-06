import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';

export default class Login extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  state = {
    email: '',
    pw: '',
    loading: false
  }

  componentDidAppear() {
    this.listener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // this.writeUserData(user.uid)
        this.authed()
      }
    })
  }

  componentDidDisappear() {
    console.log('leaving...')
    this.listener();
  }

  authed = () => {
    console.log('is this going twice?')
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

  writeUserData = async (uid) => {
    await firebase.database().ref('users/' + uid).set({
       email: this.state.email
    }).catch(e => {
      console.log('huuuuuge error..', e)
      Alert.alert('Error: ' + e)
    })
  }

  submit = async () => {
    this.setState({ loading: true })
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
        let user = await firebase.auth().createUserWithEmailAndPassword(email, pw).catch(e => {

          console.log('bork bork...', e)
          Alert.alert('Error: ' + e.message)
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
    let { loading } = this.state;
    if (loading) return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )

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
