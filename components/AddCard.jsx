import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
//import RNPickerSelect from 'react-native-picker-select';
import { db, auth } from '../database/firebase';
import { doc, collection, addDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Autocomplete from 'react-native-autocomplete-input';

import gs from './globalStyles.js';
import {toTitleCase} from './utils.js';

const WORKOUTS = [
  'Bench',
  'Deadlift',
  'Front Squat',
  'Lunge',
  'Overhead Press',
  'Squat',
];

class AddCard extends React.Component {
  constructor(props) {
    super(props);
    const data = this.props.data;
    if (data) {
      console.log(data);
      this.state = {
        showDropdown: false,
        workoutType: toTitleCase(data.workout),
        sets: String(data.sets),
        reps: String(data.reps),
        weight: String(data.weight),
      };
    } else {
      this.state = {
        showDropdown: false,
        workoutType: "",
        sets: 0,
        reps: 0,
        weight: 0,
      };
    }
    //this.setPicker = this.setPicker.bind(this)
  }

  //setPicker = (input) => {
  //  this.setState({workoutType: input});
  //}

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
    this.props.updateCard(this.props.index, {
      "workout": this.state.workoutType.toLowerCase(),
      "sets": this.state.sets,
      "reps": this.state.reps,
      "weight": this.state.weight
    });
  }

  onBlur = () => {
    this.setState({showDropdown: false});
  }

  onFocus = () => {
    this.setState({showDropdown: true});
  }

  render() {
    console.log(this.state.sets);
    const query = this.state.workoutType.toLowerCase();
    let workouts;
    if (this.state.showDropdown && query) {
      workouts = WORKOUTS.filter(item => item.toLowerCase().includes(query)).slice(0,3);
    } else {
      workouts = [];
    }

    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <Card containerStyle={[gs.card, styles.card]}>
        <View>
          <View style={styles.autocompleteContainer}>
            <Autocomplete
              autoCorrect={false}
              data={workouts.includes(this.state.workoutType) ? [] : workouts}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              inputContainerStyle={styles.inputContainer}
              style={styles.input}
              value={this.state.workoutType}
              onChangeText={(val) => this.updateInputVal(toTitleCase(val), 'workoutType')}
              placeholder="Workout type"
              placeholderTextColor={gs.textSecondaryColor}
              renderResultList={
                ({ data, flatListProps }) =>
                  <View style={styles.listContainer}>
                    <View style={styles.innerListContainer}>
                      {data.map((item, index) => (
                        <View key={index}>
                          <TouchableOpacity onPress={() => this.updateInputVal(item, 'workoutType')} style={comp(item, workouts[workouts.length - 1]) ? styles.lastItem : styles.item}>
                            <Text style={styles.itemText}>
                              {toTitleCase(item)}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
              }
            />
          </View>
        </View>
        <View style={{zIndex: -1, marginTop: 30}}>
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
    marginTop: 30,
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
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
  },
  inputContainer: {
    borderWidth: 0,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
  },
  innerListContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  listContainer: {
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    zIndex: 99,
  },
  item: {
    backgroundColor: 'white',
    borderColor: gs.textSecondaryColor,
    borderBottomWidth: 1,
  },
  lastItem: {
    backgroundColor: 'white',
  },
  itemText: {
    margin: 10,
  },
})

export default AddCard;
