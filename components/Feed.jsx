import React from 'react';
import { RefreshControl, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from '../database/firebase';
import { limit, addDoc, deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';

import {wait} from './utils.js';
import gs from './globalStyles.js';
import Loading from './Loading';
import FeedCard from './FeedCard';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      data: [],
    };
  }

  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  reload = () => {
    console.log("Loading data");
    let data = [];
    this.setState({isLoading: true});
    console.log(auth.currentUser.uid);
    const q = query(collection(db, "workouts"), orderBy('timestamp', 'desc'));
    getDocs(q).then((res) => {
      let lbLifted = 0;
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
      });
      this.setState({data: data, isLoading: false, refreshing: false});
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true},
      () => {wait(100).then(() => this.reload())}
    );
  }

  componentDidMount() {
    this.reload();
  }

  render() {
    if (this.state.isLoading){
      return(
        <View />
      );
    }
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            tintColor='white'
          />
        }>
        <View style={gs.pageContainer}>
          <View style={gs.pageHeaderBox}>
            <Text style={gs.pageHeader}>
              Global feed
            </Text>
          </View>
          <View style={gs.dividerPinkThick} />
          {this.state.data.map((item, i) => (
            <FeedCard key={i} item={item} reload={this.reload} navigation={this.props.navigation}/>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 30,
  },
  body: {
    textAlign: 'center',
  },
  button: {
    padding: 0,
    marginBottom: 0,
  },
  likes: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    textAlign: 'left',
    color: 'black',
    margin: 0,
    padding: 0,
    fontSize: 16,
  },
  subtitle: {
    color: gs.textSecondaryColor,
    margin: 0,
    padding: 0,
    fontSize: 10,
  },
  titlebar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitle: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  likeText: {
    margin: 0,
    padding: 0,
    fontSize: 10,
  },
})

export default Feed;
