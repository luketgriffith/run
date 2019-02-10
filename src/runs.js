import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';

export default class Home extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  state = {
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

  render() {
    return (
      <View style={styles.container}>
        <Text>Run History</Text>
        <TouchableOpacity onPress={() => Navigation.pop(this.props.componentId)}>
          <Text style={styles.welcome}>Back</Text>
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
