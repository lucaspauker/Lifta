import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import gs from './globalStyles';

export default class Loading extends Component {
  constructor() {
    super();
  }
  render() {
    return(
      <View style={styles.preloader}>
        <ActivityIndicator size="large" color={gs.backgroundColor}/>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
