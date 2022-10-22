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

class ProfileSettings extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.params);
    this.state = {
      firstname: '',
      lastname: '',
      isLoading: true,
    };
  }

  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.replace('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  editProfile = () => {
    this.props.navigation.navigate('EditProfile');
  }

  componentDidMount() {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      if (res.data()) {
        this.setState({
          firstname: res.data().firstname,
          lastname: res.data().lastname,
          username: res.data().username,
          email: res.data().email,
          isLoading: false
        });
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
        <View style={gs.dividerPink} />
        <View>
          <View style={gs.card}>
            <View style={styles.profileText}>
              <View style={styles.header}>
                <Text style={gs.pageHeader}>
                  {this.state.firstname + " " + this.state.lastname}
                </Text>
                <Text style={[gs.pageHeader, styles.userName]}>
                  @{this.state.username}
                </Text>
              </View>
              <Text style={[styles.email]}>
                {this.state.email}
              </Text>
            </View>
          </View>
          <View style={gs.dividerPink} />
          <View style={gs.icons}>
            <TouchableOpacity onPress={this.editProfile}>
              <Ionicons name="create-outline" size={30} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={[gs.button, styles.button]} onPress={this.signOut}>
              <Text style={[gs.buttonText, styles.buttonText]}>
                Log out
              </Text>
            </TouchableOpacity>
          </View>
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
  userName: {
    color: gs.textSecondaryColor,
  },
  email: {
    color: gs.textSecondaryColor,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  profileText: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  body: {
    textAlign: 'center',
  },
  pageContainer: {
    paddingTop: 5,
  },
  plusCard: {
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
  },
})

export default ProfileSettings;
