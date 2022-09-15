import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
//import {Picker} from '@react-native-picker/picker';
import { db, auth } from './database/firebase';
import { doc, collection, addDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      datetime: new Date().toString(),
      timestamp: new Date().getTime(),
    }).then(() => {
      this.setState({
        data: {},
        notes: '',
        title: '',
        indices: [this.state.lastIndex + 1],
        lastIndex: this.state.lastIndex + 1,
      });
      this.props.navigation.navigate('Profile')
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
          <Text style={gs.pageHeader}>
            Add Workout
          </Text>
          <Card containerStyle={[gs.card, styles.card]}>
            <TextInput
              style={[styles.input, styles.title]}
              onChangeText={(val) => this.updateInputVal(val, 'title')}
              value={this.state.title}
              placeholder="Title"
              placeholderTextColor={gs.textSecondaryColor}
            />
          </Card>
          {this.state.indices.map((ind) =>
            <AddCard key={ind} index={ind} updateCard={this.updateCard} deleteCard={this.deleteCard}/>
          )}
          <Button
            icon={
              <Ionicons name="add-circle-outline" size={30} color={gs.backgroundColor} />
            }
            title=""
            type="clear"
            style={[gs.clearButton, styles.buttonMarginTop]}
            color={gs.backgroundColor}
            onPress={this.addExercise}
          />
          <Card containerStyle={[gs.card, styles.card]}>
            <TextInput
              style={[styles.input, styles.notes]}
              onChangeText={(val) => this.updateInputVal(val, 'notes')}
              value={this.state.notes}
              multiline={true}
              placeholder="Notes"
              placeholderTextColor={gs.textSecondaryColor}
            />
          </Card>
          <Button
            title="Save"
            style={[gs.button, styles.button]}
            color={gs.backgroundColor}
            onPress={this.submit}
          />
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
  picker: {
    fontSize: 30,
    borderWidth: 1,
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
  card: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    borderWidth: 0,
  },
  notes: {
    height: 80,
    borderWidth: 0,
  },
  buttonMarginTop: {
    marginTop: 20,
  }
})

export default Add;
