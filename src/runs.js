import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';

export default class Home extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    // this.ref = firebase.firestore().collection('runs');
    // this.unsubscribe = null;
  }

  state = {
    runs: []
  }


  start = () => {
    Alert.alert('starting run...')
  }

  goToRuns = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'runs',
        options: {}
      }
    });
  }


  async componentDidAppear() {
    let uid = firebase.auth().currentUser.uid;
    let runs = [];
    let fromDb = await firebase.firestore().collection('runs').where('uid', '==', uid).get()
    fromDb.forEach((doc) => runs.push(doc.data()))
    console.log('boi::::', runs)
    this.setState({ runs });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Run History</Text>
        <TouchableOpacity onPress={() => Navigation.pop(this.props.componentId)}>
          <Text style={styles.welcome}>Back</Text>
          {
            this.state.runs.map(r => {
              return (
                <Text>{r.duration}</Text>
              )
            })
          }
        </TouchableOpacity>
      </View>
    );
  }
}

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
