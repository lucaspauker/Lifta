import React from 'react';
import { Keyboard, TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { db, auth } from '../database/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNDateTimePicker from '@react-native-community/datetimepicker';

import gs from './globalStyles.js';
import AddCard from './AddCard.jsx';

class EditWorkout extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.route.params.item.data;
    const len = Object.keys(data).length;
    console.log(this.props.route.params.item.timestamp);
    this.state = {
      showKeyboardDown: false,
      id: this.props.route.params.id,
      data: data,
      title: this.props.route.params.item.title,
      notes: this.props.route.params.item.notes,
      indices: Object.keys(data),
      lastIndex: len,
      date: new Date(this.props.route.params.item.timestamp),
      private: false,
    };
    console.log(this.state.indices);
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

  addExercise = () => {
    let newInd = this.state.indices;
    newInd.push(this.state.lastIndex + 1);
    this.setState({indices: newInd, lastIndex: this.state.lastIndex + 1});
  }


  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  focusNextField = (id) => {
    this.inputs[id].focus();
  }

  submit = () => {
    console.log("Writing data");
    let title = this.state.title;
    if (title === '') title = "Workout";
    updateDoc(doc(db, 'workouts', this.state.id), {
      data: this.state.data,
      title: title,
      notes: this.state.notes,
      timestamp: this.state.date.getTime(),
    }).then(() => {
      this.setState({
        data: {},
        notes: '',
        title: '',
        indices: [this.state.lastIndex + 1],
        lastIndex: this.state.lastIndex + 1,
        date: new Date(),
      });
      this.props.navigation.navigate('Profile', {});
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
        <View>
          <View style={[gs.pageHeaderBox, styles.pageHeaderBox]}>
            <Text style={gs.pageHeader}>
              Edit workout
            </Text>
            <TouchableOpacity style={gs.button} onPress={this.submit}>
              <Text style={gs.buttonText}>
                Save
              </Text>
            </TouchableOpacity>
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
              <View style={styles.keyboardDismiss}>
                {this.state.showKeyboardDown ?
                  <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                    <Icon name="keyboard-hide" size={25} color={gs.lightGreyColor} />
                  </TouchableOpacity>
                :""}
              </View>
              <TextInput
                blurOnSubmit={ false }
                onFocus={() => this.updateInputVal(true, 'showKeyboardDown')}
                onBlur={() => this.updateInputVal(false, 'showKeyboardDown')}
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
              <AddCard index={ind} updateCard={this.updateCard} deleteCard={this.deleteCard} data={this.state.data[ind]}/>
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
                <Text style={styles.privateText}>Add card</Text>
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
    borderWidth: 1,
    minWidth: 80,
    padding: 10,
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  titleCard: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  notesCard: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    borderWidth: 0,
  },
  input: {
    height: 40,
    minWidth: 80,
    padding: 10,
    borderRadius: 5,
    borderWidth: 0,
    borderTopWidth: 0,
  },
  notes: {
    height: 50,
    borderWidth: 0,
  },
  button: {
    borderColor: gs.primaryColor,
  },
  buttonText: {
    color: gs.primaryColor,
  },
  pageHeaderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  keyboardDismiss: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  privateText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
    paddingRight: 5,
  },
})

export default EditWorkout;

