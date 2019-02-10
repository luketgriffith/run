import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';
import moment from 'moment';
export default class SingleRun extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    // this.ref = firebase.firestore().collection('runs');
    // this.unsubscribe = null;
  }

  state = {
    runs: [],
    loading: true
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
    console.log('poprs....', this.props)
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>Single Run</Text>


        <TouchableOpacity onPress={() => Navigation.pop(this.props.componentId)}>
          <Text style={styles.welcome}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10
  },
  listText: {
    padding: 5
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
