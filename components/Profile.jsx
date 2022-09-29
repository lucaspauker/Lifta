import React from 'react';
import { RefreshControl, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from '../database/firebase';
import {deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import Animated, {FadeIn} from 'react-native-reanimated';

import {wait} from './utils.js';
import gs from './globalStyles.js';
import {toTitleCase, convertTimestamp, formatBigNumber} from './utils.js';
import Loading from './Loading';
import ProfileCard from './ProfileCard';
import Analytics from './Analytics';
import ProfileWorkouts from './ProfileWorkouts';
import ProfileSettings from './ProfileSettings';

const totalWidth = Dimensions.get("window").width;

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{
      backgroundColor: gs.secondaryColor,
      height: 2,
      marginBottom: 4,
      width: totalWidth/3 - 40,
      left: 20,
    }}
    style={styles.tabbar}
    tabStyle={styles.tab}
    activeColor={gs.secondaryColor}
    inactiveColor={gs.textSecondaryColor}
    renderLabel={({ route, focused, color }) => (
      <Text style={gs.pageHeader}>
        {route.title}
      </Text>
    )}
  />
);

function Profile({route, navigation}) {
  const [index, setIndex] = React.useState(1);
  const [routes] = React.useState([
    { key: 'first', title: 'Analytics' },
    { key: 'second', title: 'Workouts' },
    { key: 'third', title: 'Profile' },
  ]);

  return (
    <TabView
      navigation={navigation}
      navigationState={{ index, routes }}
      renderScene={
          SceneMap({
            first: () => <Analytics navigation={navigation}/>,
            second: () => <ProfileWorkouts navigation={navigation}/>,
            third: () => <ProfileSettings navigation={navigation} params={route.params}/>,
          })
        }
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: totalWidth }}
      />
  );
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: gs.lightBackgroundColor,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderColor: gs.primaryColor,
  },
  tab: {
    fontSize: 10,
    margin: 0,
    padding: 0,
    paddingTop: 5,
    borderWidth: 0,
  },
})

export default Profile;
