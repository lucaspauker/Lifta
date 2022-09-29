import React, { Component } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import gs from './globalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {ZoomIn} from 'react-native-reanimated';

export default class Loading extends Component {
  constructor() {
    super();
  }
  render() {
    return(
      <View style={styles.preloader}>
        <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
          L
        </Text>
        <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
          O
        </Text>
        <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
          A
        </Text>
        <Text style={[gs.smallHeader, gs.smallNoRightLetter]}>
          D
        </Text>
        <Ionicons name="barbell-outline" size={18} style={gs.smallBarbell}/>
        <Text style={[gs.smallHeader, gs.smallNoLeftLetter]}>
          N
        </Text>
        <Text style={[gs.smallHeader, gs.smallNormalLetter]}>
          G
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  preloader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
