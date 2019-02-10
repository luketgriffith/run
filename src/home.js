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
    this.ref = null
    this.unsubscribe = null;
  }

  state = {
    authed: true,
    running: false,
    loading: true,
    run: null,
    intervalId: null,
    timer: ''
  }

  componentDidAppear() {
    this.loadActiveRun();
  }

  componentDidDisappear() {
    clearInterval(this.state.intervalId);
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
    console.log('FROM DB>>>>>>>', fromDb)
    fromDb.forEach((doc) => {
      console.log('boooooof', doc.id)
      runs.push({ id: doc.id, ...doc.data() })
    })

    if (runs[0]) {
      console.log('got a run????????')
      this.setState({
        run: runs[0],
        loading: false
      }, () => this.timer())
    } else {
      this.setState({
        run: null,
        loading: false
      })
    }
  }

  goToSingleRun = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'singleRun',
        passProps: {
          run: this.state.run
        },
        options: {}
      }
    });
  }


  stop = async () => {
    this.setState({ running: false, loading: true })
    let time = new Date()
    let locations = await this.getLocations();
    let ourLocations = locations.filter(l => moment(l.time).isAfter(moment(ourRun.start_time)))

    let ourDoc = {
      end_time: time,
      active: false,
      duration: Math.abs(moment(this.state.run.start_time).diff(moment(time), 'minutes')),
      points: ourLocations
    }

    await firebase.firestore().collection('runs').doc(this.state.run.id).update(ourDoc);
    this.goToSingleRun()
  }


  start = async () => {
    this.configureTracking();

    let uid = firebase.auth().currentUser.uid;
    let ourRun = {
      uid: uid,
      start_time: new Date(),
      active: true,
      points: []
    };

    let id = await firebase.firestore().collection('runs').add(ourRun);
    ourRun.id = id;
    this.setState({
      running: true,
      run: ourRun
    }, () => this.timer());

  }

  timer = () => {
    let intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    this.setState({
      intervalId
    })
  }

  tick = () => {
    if (!this.state.run) return;

    let start = moment(this.state.run.start_time)
    let now = moment()
    let duration = moment.duration(now.diff(start));
    let hours = duration.hours();
    let minutes = duration.minutes();
    let seconds = duration.seconds();

    let time = `${minutes}:${seconds}`

    this.setState({ timer: time })
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
          <View>
            <Text>Timer: {this.state.timer}</Text>
            <TouchableOpacity onPress={() => this.stop()}>
              <Text style={styles.welcome}>End Run</Text>
            </TouchableOpacity>
          </View>
           : null
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
