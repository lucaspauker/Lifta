import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { db, auth } from '../database/firebase';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

import gs from './globalStyles.js';
import Loading from './Loading';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      isLoading: true,
    }
  }

  submit = () => {
    console.log("Edit profile");
    //this.state.updateProfile(this.state.email, this.state.firstname, this.state.lastname);
    updateDoc(doc(db, 'users', auth.currentUser.uid), {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
    }).then(() => {
      this.props.navigation.navigate('Profile', {});
    });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  componentDidMount() {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      if (res.data()) {
        this.setState({email: res.data().email, lastname: res.data().lastname, firstname: res.data().firstname, isLoading: false});
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
        <View>
          <View style={[gs.pageHeaderBox, styles.pageHeaderBox]}>
            <Text style={gs.pageHeader}>
              Edit Profile
            </Text>
            <TouchableOpacity style={gs.button} onPress={this.submit}>
              <Text style={gs.buttonText}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
          <View style={gs.dividerPink} />
          <View style={gs.card}>
            <View style={styles.box}>
              <Text style={styles.label}>First name</Text>
              <TextInput
                style={[styles.input]}
                onChangeText={(val) => this.updateInputVal(val, 'firstname')}
                value={this.state.firstname}
                placeholder="First name"
                placeholderTextColor={gs.textSecondaryColor}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={[styles.input]}
                onChangeText={(val) => this.updateInputVal(val, 'lastname')}
                value={this.state.lastname}
                placeholder="Last name"
                placeholderTextColor={gs.textSecondaryColor}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  pageHeaderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default EditProfile;

