import React from 'react';
import { RefreshControl, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from '../database/firebase';
import {deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Animated, {FadeIn} from 'react-native-reanimated';

import {wait} from './utils.js';
import gs from './globalStyles.js';
import {formatBigNumber} from './utils.js';
import Loading from './Loading';
import ProfileCard from './ProfileCard';

class ProfileWorkouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isLoading: true,
      data: [],
      totalWorkouts: 0,
      lbLifted: 0,
      refreshing: false,
    };
  }

  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.replace('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  reload = () => {
    console.log("Loading data");
    let data = [];
    this.setState({isLoading: true});
    console.log(auth.currentUser.uid);
    const q = query(collection(db, "workouts"), where('user', '==', auth.currentUser.uid));
    getDocs(q).then((res) => {
      let lbLifted = 0;
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
        Object.keys(id.data).forEach((w) => {
          lbLifted += id.data[w].reps * id.data[w].sets * id.data[w].weight;
        });
      });
      //console.log(data);
      data.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({data: data, isLoading: false, totalWorkouts: data.length, lbLifted: formatBigNumber(lbLifted), refreshing: false});
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true},
      () => {this.reload()}
    );
  }

  componentDidMount() {
    this.reload();
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      if (res.data()) {
        this.setState({name: res.data().firstname});
      }
    });
  }

  render() {
    if (this.state.isLoading){
      return(
        <Loading/>
      );
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            tintColor='white'
          />
        }>
        <View style={gs.dividerPink} />
        <View style={[gs.pageContainer, styles.pageContainer]}>
          <View style={styles.stats}>
            <Text>
              Total workouts: {this.state.totalWorkouts}
            </Text>
            <Text>
              Pounds lifted: {this.state.lbLifted}
            </Text>
          </View>
          <View style={gs.dividerPink} />
          {this.state.data.map((item) => (
            <View key={item.key}>
              <ProfileCard item={item} reload={this.reload} navigation={this.props.navigation}/>
              <View style={gs.dividerPink} />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  stats: {
    fontSize: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  pageContainer: {
    backgroundColor: gs.primaryColor,
    paddingTop: 0,
  },
})

export default ProfileWorkouts;
