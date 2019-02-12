import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Navigation } from 'react-native-navigation';
import firebase from 'react-native-firebase';
import moment from 'moment';
import MapView, { Polyline } from 'react-native-maps';

export default class SingleRun extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    // this.ref = firebase.firestore().collection('runs');
    // this.unsubscribe = null;
  }

  state = {
    runs: [],
    loading: true,
    points: []
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

  getPoints = () => {
    return this.props.run.points.map(p => ({ latitude: p.lat, longitude: p.lng }))
  }

  render() {
    console.log('runnsdfasdf', this.props.run.points)
    return (
      <View style={styles.container}>
        <Text>Single Run</Text>
        <View>
          {
            this.props.run && this.props.run.points && this.props.run.points.length ?
            <MapView
            region={{
              latitude: this.props.run.points[0].lat,
              longitude: this.props.run.points[0].lng
            }}
            minZoomLevel={5}
            maxZoomLevel={20}
            style={styles.map}>
            <Polyline
            coordinates={this.getPoints()}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider

            strokeWidth={6}
            />
            </MapView> : null

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
  map: {
    height: 400,
    width: 400
  },
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
