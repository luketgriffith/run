import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';
import moment from 'moment';
export default class Home extends Component {
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
    let uid = firebase.auth().currentUser.uid;
    let runs = [];
    let fromDb = await firebase.firestore().collection('runs').where('uid', '==', uid).get()
    fromDb.forEach((doc) => runs.push(doc.data()))
    console.log('boi::::', runs)
    this.setState({ runs, loading: false });
  }

  goToSingleRun = (run) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'singleRun',
        passProps: {
          run: run
        },
        options: {}
      }
    });
  }

  render() {

    return (
      <View style={styles.container}>
        <Text>Run History</Text>
        <View>
        {
          this.state.loading ? <ActivityIndicator/> :
          this.state.runs.map((r, i) => {
            return (
              <TouchableOpacity onPress={() => this.goToSingleRun(r)}>
              <View style={styles.listItem} key={i}>
                <Text style={styles.listText}>{moment(r.start_time).format('DD/MM')}</Text>
                <Text style={styles.listText}>{r.duration} min.</Text>
              </View>
              </TouchableOpacity>
            )
          })
        }
        </View>
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
