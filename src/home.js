import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import firebase from 'react-native-firebase';
import moment from 'moment';

export default class Home extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.ref = firebase.firestore().collection('runs');
    this.unsubscribe = null;
  }

  state = {
    authed: true,
    running: false,
    run: null
  }

  componentDidAppear() {
    this.loadActiveRun();
  }

  getLocations = (appointment) => {
    return new Promise((res, no) => {
      BackgroundGeolocation.getValidLocations(function(locations, error) {
        if (error) {
          console.log('BAD ONE HERE BOB', error)
        }
        if (!locations || error) {
          res([])
        }
        let ours = locations.map(l => {
          return  { lat: l.longitude, lng: l.latitude, time: l.time }
        })
        res(ours)
      })
    })
  }

  loadActiveRun = async () => {
    let uid = firebase.auth().currentUser.uid;
    let runs = [];
    let fromDb = await firebase.firestore().collection('runs').where('uid', '==', uid).where('active', '==', true).get()
    fromDb.forEach((doc) => runs.push(doc.data()))
    if (runs[0]) {
      this.setState({
        run: runs[0]
      })
    } else {
      this.setState({
        run: null
      })
    }
  }

  stop = () => {
    this.setState({ running: false })

    let uid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('runs')
      .where('uid', '==', uid)
      .where('active', '==', true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            let ourRun = doc.data();
            console.log("AAAASDFASD", ourRun)
            this.setState({ run: ourRun })
            let time = new Date()
            let locations = await this.getLocations();
            let ourLocations = locaions.filter(l => moment(l.time).isAfter(moment(ourRun.start_time)))
            doc.ref.update({
              end_time: time,
              active: false,
              duration: Math.abs(moment(ourRun.start_time).diff(moment(time), 'minutes')),
              points: ourLocations
            }).then((b) => {
              console.log('hooray')
            }).catch(e => {
              console.log('awful bad error here', e)
            })
        })
      })
  }


  start = () => {
    this.configureTracking()
    this.setState({
      running: true
    });

    let uid = firebase.auth().currentUser.uid;
    this.ref.add({
      uid: uid,
      start_time: new Date(),
      active: true,
      points: []
    });
  }

  goToRuns = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'runs',
        options: {}
      }
    });
  }

  configureTracking = () => {
    // Analytics.trackEvent('Starting up', { hello: 'its me' })
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 5,
      distanceFilter: 8,
      notificationsEnabled: true,
      notificationTitle: 'Skipper',
      notificationText: 'Tracking the walk',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: Platform.OS === 'ios' ? BackgroundGeolocation.DISTANCE_FILTER_PROVIDER : BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 2000,
      fastestInterval: 1000,
      activitiesInterval: 1000,
      stopOnStillActivity: false,
      startForeground: true,
      // url: 'http://localhost:8080/sitter/appointments/location'
    }, function() {
      BackgroundGeolocation.start()
    }, function() {
      Alert.alert('Error configuring geolocation.')
    });

    BackgroundGeolocation.on('authorization', (status) => {
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(() =>
          Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
            { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
            { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
          ]), 1000);
      }
    });

    // BackgroundGeolocation.on('location', (location) => {
    //   // handle your locations here
    //   // to perform long running operation on iOS
    //   // you need to create background task
    // });

  }

  stopTracking = () => {
    BackgroundGeolocation.stop()
  }

  signOut = () => {
    if (!this.state.authed) return;
    this.setState({ authed: false }, () => {
      firebase.auth().signOut().then(() => {
        Navigation.push(this.props.componentId, {
          component: {
            name: 'login',
            options: {}
          }
        });
      })
    })
  }

  render() {
    if (this.state.loading) return (
      <View style={styles.container}>
        <ActivityIndicator/>
      </View>
    )
    return (
      <View style={styles.container}>
        {
          this.state.run  ? null :
          <TouchableOpacity onPress={() => this.start()}>
            <Text style={styles.welcome}>Start Run</Text>
          </TouchableOpacity>
        }
        {
          this.state.run  ?
          <TouchableOpacity onPress={() => this.stop()}>
            <Text style={styles.welcome}>End Run</Text>
          </TouchableOpacity> : null
        }
        <TouchableOpacity onPress={() => this.goToRuns()}>
          <Text style={styles.welcome}>View Run History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.signOut()}>
          <Text style={styles.welcome}>Log Out</Text>
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
