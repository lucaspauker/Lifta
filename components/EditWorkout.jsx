import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { db, auth } from '../database/firebase';
import { updateDoc, doc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      indices: [...Array(len).keys()],
      lastIndex: len,
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

  submit = () => {
    console.log("Writing data");
    let title = this.state.title;
    if (title === '') title = "Workout";
    updateDoc(doc(db, 'workouts', this.state.id), {
      data: this.state.data,
      title: title,
    }).then(() => {
      this.setState({
        data: {},
        indices: [this.state.lastIndex + 1],
        lastIndex: this.state.lastIndex + 1,
      });
      this.props.navigation.navigate('Profile', {});
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={gs.pageContainer}>
          <Text style={gs.pageHeader}>
            Edit Workout
          </Text>
          <TextInput
            style={[styles.input, styles.title]}
            onChangeText={(val) => this.updateInputVal(val, 'title')}
            value={this.state.title}
            placeholder="Title"
            placeholderTextColor={gs.textSecondaryColor}
          />
          {this.state.indices.map((ind) =>
            <AddCard key={ind} index={ind} updateCard={this.updateCard} deleteCard={this.deleteCard} data={this.state.data[String(this.state.indices[ind])]}/>
          )}
          <Button
            icon={
              <Ionicons name="add-circle-outline" size={30} color={gs.backgroundColor} />
            }
            title=""
            type="clear"
            style={gs.clearButton}
            color={gs.backgroundColor}
            onPress={this.addExercise}
          />
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
  title: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
})

export default EditWorkout;

