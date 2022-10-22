import React from 'react';
import { Keyboard, TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { db, auth } from '../database/firebase';
import { doc, collection, addDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import gs from './globalStyles.js';
import AddCard from './AddCard.jsx';

class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      indices: [0],
      lastIndex: 0,
      title: '',
      notes: '',
      date: new Date(),
      private: false,
    };
    this.inputs = {};
  }

  updateCard = (index, data) => {
    console.log(index, data);
    let newData = this.state.data;
    newData[index] = data;
    this.setState({data: newData});
  }

  deleteCard = (index) => {
    const i = this.state.indices.indexOf(index);
    let newInd = this.state.indices;
    let newData = this.state.data;
    if (i > -1) { // only splice array when item is found
      newInd.splice(i, 1); // 2nd parameter means remove one item only
      delete newData[index];
    }
    this.setState({indices: newInd, data: newData});
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  submit = () => {
    console.log("Writing data");
    let title = this.state.title;
    if (title === '') title = "Workout";
    addDoc(collection(db, 'workouts'), {
      data: this.state.data,
      title: title,
      user: auth.currentUser.uid,
      notes: this.state.notes,
      datetime: this.state.date.toString(),
      timestamp: this.state.date.getTime(),
    }).then(() => {
      this.setState({
        data: {},
        notes: '',
        title: '',
        indices: [this.state.lastIndex + 1],
        lastIndex: this.state.lastIndex + 1,
        Date: new Date(),
      });
      this.props.navigation.navigate('Profile')
    });
  }

  clear = () => {
    this.setState({
      data: {},
      notes: '',
      title: '',
      indices: [this.state.lastIndex + 1],
      lastIndex: this.state.lastIndex + 1,
      date: new Date(),
    });
  }

  addExercise = () => {
    let newInd = this.state.indices;
    newInd.push(this.state.lastIndex + 1);
    this.setState({indices: newInd, lastIndex: this.state.lastIndex + 1});
  }

  focusNextField = (id) => {
    this.inputs[id].focus();
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
        <View>
          <View style={gs.pageContainer}>
            <View style={[gs.pageHeaderBox, styles.pageHeaderBox]}>
              <Text style={gs.pageHeader}>
                Add a workout
              </Text>
              <View style={styles.buttons}>
                <TouchableOpacity style={gs.redButton} onPress={this.clear}>
                  <Text style={gs.redButtonText}>
                    Reset
                  </Text>
                </TouchableOpacity>
                <View style={styles.smallSpace} />
                <TouchableOpacity style={gs.button} onPress={this.submit}>
                  <Text style={gs.buttonText}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={gs.dividerPink} />
          <View style={gs.card}>
            <View style={gs.datetimeBox}>
              <RNDateTimePicker
                themeVariant="light"
                mode="datetime"
                value={this.state.date}
                onChange={(e, val) => this.updateInputVal(val, 'date')}
                accentColor={gs.primaryColor}
                style={gs.datetime}
              />
            </View>
            <View style={[styles.titleCard]}>
              <TextInput
                returnKeyType={ "next" }
                blurOnSubmit={ false }
                onSubmitEditing={() => {
                  this.focusNextField('notes');
                }}
                ref={ input => {
                  this.inputs['title'] = input;
                }}
                style={[styles.input, styles.title]}
                onChangeText={(val) => this.updateInputVal(val, 'title')}
                value={this.state.title}
                placeholder="Workout title"
                placeholderTextColor={gs.textSecondaryColor}
              />
            </View>
            <View style={[styles.notesCard]}>
              <TextInput
                blurOnSubmit={ false }
                onSubmitEditing={() => {
                }}
                ref={ input => {
                  this.inputs['notes'] = input;
                }}
                style={[styles.input, styles.notes]}
                onChangeText={(val) => this.updateInputVal(val, 'notes')}
                value={this.state.notes}
                multiline={true}
                placeholder="Notes"
                placeholderTextColor={gs.textSecondaryColor}
              />
            </View>
          </View>
          <View style={gs.dividerPink} />
          {this.state.indices.map((ind) =>
            <View key={ind}>
              <AddCard index={ind} updateCard={this.updateCard} deleteCard={this.deleteCard}/>
               <View style={gs.dividerPink} />
            </View>
          )}
          <View style={[gs.icons, styles.icons]}>
            {this.state.private ?
              <TouchableOpacity onPress={() => this.updateInputVal(false, 'private')}>
                <View style={gs.centerColumnBox}>
                  <Ionicons name="close-circle-outline" size={30} color={'white'} />
                  <Text style={styles.privateText}>Private</Text>
                </View>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => this.updateInputVal(true, 'private')}>
                <View style={gs.centerColumnBox}>
                  <Ionicons name="checkmark-circle" size={30} color={'white'} />
                  <Text style={styles.privateText}>Public</Text>
                </View>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={this.addExercise}>
              <View style={gs.centerColumnBox}>
                <Ionicons name="add-circle-outline" size={30} color={'white'} />
                  <Text style={styles.privateText}>Add workout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    minWidth: 80,
    padding: 10,
    borderRadius: 5,
    borderWidth: 0,
    borderTopWidth: 0,
  },
  icons: {
    alignItems: 'flex-start',
  },
  privateText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    paddingRight: 5,
  },
  button: {
    borderColor: gs.primaryColor,
  },
  buttonText: {
    color: gs.primaryColor,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 10,
    width: 100,
  },
  picker: {
    fontSize: 30,
    padding: 10,
    borderRadius: 5,
  },
  innerPicker: {
    placeholder: {
      color: gs.textSecondaryColor,
    },
  },
  weight: {
    marginTop: gs.mediumSpace,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleCard: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  notesCard: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    borderWidth: 0,
  },
  notes: {
    height: 50,
    borderWidth: 0,
  },
  clearButton: {
    margin: 0,
    marginTop: 10,
    padding: 0,
  },
  pageHeaderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallSpace: {
    width: 10,
  },
  plusCard: {
    paddingTop: 0,
    paddingBottom: 0,
  },
})

export default Add;
