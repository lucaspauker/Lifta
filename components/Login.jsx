import React, { Component } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../database/firebase';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loading from './Loading';
import gs from './globalStyles';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false
    }
    this.inputs = {};
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLogin = () => {
    if(this.state.email === '' && this.state.password === '') {
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
        .catch(error => this.setState({ isLoading: false, errorMessage: error.message }))
    }
  }

  focusNextField = (id) => {
    this.inputs[id].focus();
  }

  render() {
    if (this.state.isLoading) {
      return(
        <Loading />
      );
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.props.navigation.replace('Home');
      }
    });
    return (
      <View style={gs.container}>
        <View style={styles.header}>
          <Text style={[gs.header, gs.noRightLetter]}>
            L
          </Text>
          <Ionicons name="barbell-outline" size={35} style={gs.barbell}/>
          <Text style={[gs.header, gs.noLeftLetter]}>
            F
          </Text>
          <Text style={[gs.header, gs.normalLetter]}>
            T
          </Text>
          <Text style={[gs.header, gs.normalLetter]}>
            A
          </Text>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Text
            style={styles.errorText}>
            {this.state.errorMessage}
          </Text>
          <TextInput
            returnKeyType={ "next" }
            blurOnSubmit={ false }
            onSubmitEditing={() => {
              this.focusNextField('password');
            }}
            ref={ input => {
              this.inputs['username'] = input;
            }}
            style={styles.inputStyle}
            placeholder="Email"
            placeholderTextColor={gs.textSecondaryColor}
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
          <TextInput
            returnKeyType={ "done" }
            blurOnSubmit={ false }
            onSubmitEditing={() => {
              this.userLogin()
            }}
            ref={ input => {
              this.inputs['password'] = input;
            }}
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
        </KeyboardAvoidingView>
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
