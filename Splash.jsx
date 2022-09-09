import React, {useState, useEffect} from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import gs from './globalStyles.js';

const Splash = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      navigation.replace('Home');
    }, 1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LIFTA</Text>
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gs.backgroundColor,
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  header: {
    textAlign: 'center',
    fontSize: 30,
  },
});

export default Splash;
