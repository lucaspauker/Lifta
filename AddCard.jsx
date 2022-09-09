import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import RNPickerSelect from 'react-native-picker-select';
import { db, auth } from './database/firebase';
import { doc, collection, addDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

import gs from './globalStyles.js';

class AddCard extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.data;
    if (data) {
      console.log(data);
      this.state = {
        workoutType: data.workout,
        sets: String(data.sets),
        reps: String(data.reps),
        weight: String(data.weight),
      };
    } else {
      this.state = {
        workoutType: "",
        sets: 0,
        reps: 0,
        weight: 0,
      };
    }
    this.setPicker = this.setPicker.bind(this)
  }

  setPicker(input) {
    this.setState({workoutType: input});
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
    this.props.updateCard(this.props.index, {
      "workout": this.state.workoutType,
      "sets": this.state.sets,
      "reps": this.state.reps,
      "weight": this.state.weight
    });
  }

  render() {
    console.log(this.state.sets);
    return (
      <Card containerStyle={[gs.card, styles.card]}>
        <View style={styles.picker}>
          <RNPickerSelect
            style={styles.innerPicker}
            placeholder={{
              label: 'Exercise',
              value: null,
            }}
            value={this.state.workoutType}
            onValueChange={this.setPicker}
            items = {[
              {label: "Squat", value: "squat"},
              {label: "Bench", value: "bench"},
              {label: "Deadlift", value: "deadlift"},
              {label: "Overhead Press", value: "ohp"},
            ]}
          />
        </View>
        <View style={styles.weight}>
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.updateInputVal(parseInt(val), 'sets')}
            value={this.state.sets}
            placeholder="Sets"
            placeholderTextColor={gs.textSecondaryColor}
            keyboardType="numeric"
          />
          <Text>x</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.updateInputVal(parseInt(val), 'reps')}
            value={this.state.reps}
            placeholder="Reps"
            placeholderTextColor={gs.textSecondaryColor}
            keyboardType="numeric"
          />
          <Text>@</Text>
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.updateInputVal(parseInt(val), 'weight')}
            value={this.state.weight}
            placeholder="Weight"
            placeholderTextColor={gs.textSecondaryColor}
            keyboardType="numeric"
          />
        </View>
        <View style={[gs.buttons, styles.buttons]}>
          <TouchableOpacity style={[gs.clearButton, styles.buttonMarginTop]} onPress={() => {this.props.deleteCard(this.props.index)}}>
            <Ionicons name="trash-outline" size={20} color={gs.backgroundColor} />
          </TouchableOpacity>
        </View>
      </Card>
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
    marginTop: 10,
  },
  card: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  buttons: {
    borderTopWidth: 0,
  },
  buttonMarginTop: {
    marginTop: 20,
  }
})

export default AddCard;
