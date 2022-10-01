import React from 'react';
import { FlatList, RefreshControl, TouchableOpacity, SafeAreaView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from '../database/firebase';
import { startAfter, limit, addDoc, deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
//import Animated, {FadeIn} from 'react-native-reanimated';

import {wait} from './utils.js';
import gs from './globalStyles.js';
import Loading from './Loading';
import FeedCard from './FeedCard';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingBottom: false,
      refreshing: false,
      data: [],
      lastVisible: null,
    };
  }

  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  loadMore = () => {
    console.log("Loading more data");
    let data = this.state.data;
    this.setState({isLoadingBottom: true});
    if (!this.state.lastVisible) return;
    const q = query(collection(db, "workouts"), orderBy('timestamp', 'desc'), startAfter(this.state.lastVisible), limit(5));
    getDocs(q).then((res) => {
      let lbLifted = 0;
      res.forEach((item) => {
        let id = item.data();
        console.log(id);
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
      });
      console.log(res.length);
      this.setState({data: data, refreshing: false, lastVisible: res.docs[res.docs.length-1], isLoadingBottom: false});
    });
  }

  reload = () => {
    console.log("Loading data");
    let data = [];
    this.setState({isLoading: true});
    const q = query(collection(db, "workouts"), orderBy('timestamp', 'desc'), limit(5));
    getDocs(q).then((res) => {
      let lbLifted = 0;
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
      });
      this.setState({data: data, isLoading: false, refreshing: false, lastVisible: res.docs[res.docs.length-1]});
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true},
      () => {wait(100).then(() => this.reload())}
    );
  }

  renderFooter = () => {
    if (this.state.isLoadingBottom) {
      return (
        <View style={gs.footer}>
          <ActivityIndicator color='white'/>
        </View>
      )
    } else {
      return null;
    }
  };

  componentDidMount() {
    this.reload();
  }

  render() {
    if (this.state.isLoading){
      return(
        <Loading />
      );
    }
    return (
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
              tintColor='white'
            />}
          ListHeaderComponent={
            <View style={gs.pageContainer}>
              <View style={gs.pageHeaderBox}>
                <Text style={gs.pageHeader}>
                  Global feed
                </Text>
              </View>
              <View style={gs.dividerPinkThick} />
            </View>
          }
          data={this.state.data}
          renderItem={(item) => (
            <FeedCard item={item.item} reload={this.reload} navigation={this.props.navigation}/>
          )}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => String(index)}
          onEndReached={this.loadMore}
          refreshing={this.state.refreshing}
        />
      </SafeAreaView>
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
