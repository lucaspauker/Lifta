import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { db, auth } from '../database/firebase';
import { where, orderBy, query, collection, getDocs, getDoc, updateDoc, doc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

import gs from './globalStyles.js';
import Loading from './Loading';
import FeedCard from './FeedCard';

class UserPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.id,
      username: '',
      firstname: '',
      lastname: '',
      isLoading: true,
      data: [],
    }
  }

  reload = () => {
    console.log("Loading data");
    let data = [];
    this.setState({isLoading: true});
    console.log(auth.currentUser.uid);
    const q = query(collection(db, "workouts"), where('user', '==', this.state.id));
    getDocs(q).then((res) => {
      let lbLifted = 0;
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
      });
      data.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({data: data, isLoading: false});
    });
  }

  componentDidMount() {
    this.reload();
    getDoc(doc(db, "users", this.state.id)).then((res) => {
      if (res.data()) {
        this.setState({lastname: res.data().lastname, firstname: res.data().firstname, username: res.data().username, isLoading: false});
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
      <ScrollView>
        <View style={gs.pageContainer}>
          <View style={styles.profileText}>
            <View style={styles.header}>
              <Text style={gs.pageHeader}>
                {this.state.firstname + " " + this.state.lastname}
              </Text>
              <Text style={[gs.pageHeader, styles.username]}>
                @{this.state.username}
              </Text>
            </View>
          </View>
          <View style={gs.dividerPink} />
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: gs.textSecondaryColor,
  },
  input: {
    height: 40,
    borderWidth: 1,
    minWidth: 80,
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  box: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  profileText: {
    marginLeft: 20,
    marginRight: 20,
  },
})

export default UserPage;

