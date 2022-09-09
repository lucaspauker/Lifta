import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from './database/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import gs from './globalStyles';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false
    }
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  userLogin = () => {
    if(this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      this.setState({
        isLoading: true,
      })
      signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((res) => {
          console.log('User logged-in successfully!')
          this.setState({
            isLoading: false,
            email: '',
            password: ''
          })
          this.props.navigation.replace('Home')
        })
        .catch(error => this.setState({ errorMessage: error.message }))
    }
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
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
        <View style={styles.button}>
          <Button
            color={gs.textColor}
            title="Sign In"
            onPress={() => this.userLogin()}
          />
        </View>
        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.replace('Signup')}>
          Don't have account? Click here to sign up.
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
