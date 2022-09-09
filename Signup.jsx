// components/signup.js
import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db, auth, provider } from './database/firebase';
import { doc, collection, addDoc, setDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

import gs from './globalStyles';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      displayName: '',
      email: '',
      password: '',
      firstname: '',
      lastname: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      this.setState({ isLoading: true, });
      createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((res) => {
          console.log(res.user.uid);
          setDoc(doc(db, 'users', res.user.uid), {
            email: this.state.email,
            username: this.state.displayName.toLowerCase(),
            firstname: this.state.firstname,
            lastname: this.state.lastname,
          }).then(() => {
            console.log('User registered successfully!')
            this.setState({
              isLoading: false,
              displayName: '',
              email: '',
              password: ''
            })
            this.props.navigation.replace('Home')
          });
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            errorMessage: error.message
          })
        });
    }
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      );
    }

    return (
      <View style={gs.container}>
        <View style={styles.header}>
          <Ionicons name="barbell-outline" size={50} style={styles.barbell}/>
          <Text style={gs.header}>
            Lifta
          </Text>
          <Ionicons name="barbell-outline" size={50} style={styles.barbell}/>
        </View>
        <Text
          style={styles.errorText}>
          {this.state.errorMessage}
        </Text>
        <TextInput
          style={styles.inputStyle}
          placeholder="Username"
          placeholderTextColor={gs.textSecondaryColor}
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="First name"
          placeholderTextColor={gs.textSecondaryColor}
          value={this.state.firstname}
          onChangeText={(val) => this.updateInputVal(val, 'firstname')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Last name"
          placeholderTextColor={gs.textSecondaryColor}
          value={this.state.lastname}
          onChangeText={(val) => this.updateInputVal(val, 'lastname')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          placeholderTextColor={gs.textSecondaryColor}
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          placeholderTextColor={gs.textSecondaryColor}
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />
        <Button
          color={gs.textColor}
          title="Sign Up"
          onPress={() => this.registerUser()}
        />
        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.replace('Login')}>
          Already Registered? Click here to login
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    marginBottom: gs.mediumSpace,
    paddingBottom: gs.smallSpace,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    color: gs.textColor,
  },
  loginText: {
    color: gs.textSecondaryColor,
    marginTop: gs.mediumSpace,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  barbell: {
    margin: 20,
    color: gs.textColor,
  },
  header: {
    width: '100%',
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: 'center',
    color: gs.textColor,
    marginBottom: gs.bigSpace,
  },
  button: {
    marginTop: gs.mediumSpace,
  }
});

export default Signup;
