import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { db, auth } from '../database/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import gs from './globalStyles.js';
import AddCard from './AddCard.jsx';

class EditWorkout extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.route.params.item.data;
    const len = Object.keys(data).length;
    this.state = {
      id: this.props.route.params.id,
      data: data,
      title: this.props.route.params.item.title,
      notes: this.props.route.params.item.notes,
      indices: [...Array(len).keys()],
      lastIndex: len,
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
    if (i > -1) { // only splice array when item is found
      newInd.splice(i, 1); // 2nd parameter means remove one item only
    }
    this.setState({indices: newInd});
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
    }).then(() => {
      this.setState({
        data: {},
        notes: '',
        title: '',
        indices: [this.state.lastIndex + 1],
        lastIndex: this.state.lastIndex + 1,
      });
      this.props.navigation.navigate('Profile', {});
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
        <View style={gs.pageContainer}>
          <View style={gs.pageHeaderBox}>
            <Text style={gs.pageHeader}>
              Edit workout
            </Text>
          </View>
          <View style={gs.dividerPink} />
          <Card containerStyle={[gs.card, styles.titleCard]}>
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
          </Card>
          <Card containerStyle={[gs.card, styles.notesCard]}>
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
          </Card>
          <View style={gs.dividerPink} />
          {this.state.indices.map((ind) =>
            <View key={ind}>
              <AddCard index={ind} updateCard={this.updateCard} deleteCard={this.deleteCard} data={this.state.data[String(this.state.indices[ind])]}/>
               <View style={gs.dividerPink} />
            </View>
          )}
          <View style={gs.icons}>
            <TouchableOpacity style={[gs.card, gs.plusCard]} onPress={this.addExercise}>
              <Ionicons name="add-circle-outline" size={30} color={gs.backgroundColor} />
            </TouchableOpacity>
            <TouchableOpacity style={[gs.card, gs.plusCard]} onPress={this.submit}>
              <Ionicons name="save-outline" size={25} color={gs.backgroundColor} />
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
    height: 80,
    borderWidth: 0,
  },
})

export default EditWorkout;

