import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
//import {Picker} from '@react-native-picker/picker';
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
    };
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
    if (i > -1) { // only splice array when item is found
      newInd.splice(i, 1); // 2nd parameter means remove one item only
    }
    this.setState({indices: newInd});
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  submit = () => {
    console.log("Writing data");
    console.log(this.state.data);
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

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={gs.pageContainer}>
          <View style={[gs.pageHeaderBox, styles.pageHeaderBox]}>
            <Text style={gs.pageHeader}>
              Add a workout
            </Text>
            <TouchableOpacity style={gs.button} onPress={this.clear}>
              <Text style={gs.buttonText}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
          <View style={gs.dividerPink} />
          <View style={styles.datetimeBox}>
            <RNDateTimePicker
              themeVariant="light"
              mode="datetime"
              value={this.state.date}
              onChange={(e, val) => this.updateInputVal(val, 'date')}
              accentColor={gs.primaryColor}
              style={styles.datetime}
            />
          </View>
          <Card containerStyle={[gs.card, styles.card, styles.titleCard]}>
            <TextInput
              style={[styles.input, styles.title]}
              onChangeText={(val) => this.updateInputVal(val, 'title')}
              value={this.state.title}
              placeholder="Workout title"
              placeholderTextColor={gs.textSecondaryColor}
            />
          </Card>
          <Card containerStyle={[gs.card, styles.card, styles.notesCard]}>
            <TextInput
              style={[styles.input, styles.notes]}
              onChangeText={(val) => this.updateInputVal(val, 'notes')}
              value={this.state.notes}
              multiline={true}
              placeholder="Notes"
              placeholderTextColor={gs.textSecondaryColor}
            />
          </Card>
          <View style={gs.dividerPink} />
          {this.state.indices.map((ind) =>
            <View key={ind}>
              <AddCard index={ind} updateCard={this.updateCard} deleteCard={this.deleteCard}/>
               <View style={gs.dividerPink} />
            </View>
          )}
          <TouchableOpacity style={[gs.card, styles.plusCard]} onPress={this.addExercise}>
            <Ionicons name="add-circle-outline" size={30} color={gs.backgroundColor} />
          </TouchableOpacity>
          <View style={gs.dividerPink} />
          <View style={gs.centerBox}>
            <TouchableOpacity style={[gs.button, styles.saveButton]} onPress={this.submit}>
              <Text style={gs.buttonText}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  button: {
  },
  plusCard: {
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  notes: {
    height: 80,
    borderWidth: 0,
  },
  clearButton: {
    margin: 0,
    marginTop: 10,
    padding: 0,
  },
  datetimeBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    width: '100%',
    paddingRight: 10,
  },
  datetime: {
    margin: 0,
    padding: 0,
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
  },
  pageHeaderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default Add;
