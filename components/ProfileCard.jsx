import React from 'react';
import { TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card } from "@rneui/base";
import { db, auth } from '../database/firebase';
import {deleteDoc, doc, collection, query, where} from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DoubleClick from 'react-native-double-tap';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import gs from './globalStyles.js';
import {toTitleCase, convertTimestamp } from './utils.js';
import CustomIcon from './CustomIcon';

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
    }
  }

  deleteEntry = (id) => {
    console.log("Deleting " + id);
    this.setState({isLoading: true});
    deleteDoc(doc(db, "workouts", id)).then(() => {
      this.props.reload();
    });
  }

  editEntry = (id) => {
    console.log("Editing " + id);
    this.props.navigation.navigate('EditWorkout', {
      id: id,
      item: this.props.item,
    });
  }

  render() {
    const item = this.props.item;
    return (
      <DoubleClick
        singleTap={() => {
          this.props.navigation.navigate('Workout', {id: item.key, userId: auth.currentUser.uid})
        }}
        doubleTap={() => {
          this.likePost()
        }}
        delay={200}>
        <Card key={item.timestamp} containerStyle={gs.card}>
          <View style={gs.leftright}>
            <View style={gs.left}>
              <View style={gs.topsection}>
                <View style={gs.titlebar}>
                  {Object.keys(item.data).length > 0 && item.data[Object.keys(item.data)[0]]["workout"] === "bench" ?
                    <CustomIcon name='bicep' size={25} style={gs.armleg}/>
                  : Object.keys(item.data).length > 0 && (item.data[Object.keys(item.data)[0]]["workout"] === "squat" || item.data[Object.keys(item.data)[0]]["workout"] === "front squat") ?
                    <CustomIcon name='leg' size={30} style={gs.armleg}/>
                  :
                    <Ionicons name="barbell-outline" size={30} style={gs.armleg}/>
                  }

                  <Text style={gs.title}>
                    {item.title}
                  </Text>
                </View>
                <Text style={gs.subtitle}>
                  {convertTimestamp(item.timestamp)}
                </Text>
                {item.notes ? <Text style={gs.notes}>{item.notes}</Text> : ''}
              </View>
            </View>
            <View style={gs.right}>
              <View style={gs.buttons}>
                <TouchableOpacity style={gs.clearButton} onPress={() => {this.editEntry(item.key)}}>
                  <Ionicons name="create-outline" size={36} color={gs.backgroundColor} />
                </TouchableOpacity>
                <TouchableOpacity style={gs.clearButton} onPress={() => {this.deleteEntry(item.key)}}>
                  <Ionicons name="trash-outline" size={36} color={gs.backgroundColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={gs.dividerMedium} />
          <View style={gs.dividerLight} />
          <View style={gs.bottom}>
            <View style={gs.workouts}>
              {Object.values(item.data).map((workout, i) => (
                <View key={i}>
                  <View style={gs.workout}>
                    <Text style={gs.workoutTitle}>
                      {toTitleCase(workout.workout)}
                    </Text>
                    <Text style={gs.workoutBody}>
                      {workout.sets}x{workout.reps}@{workout.weight}lb
                    </Text>
                  </View>
                  {i < Object.values(item.data).length - 1 ? <View style={gs.divider}/> : ""}
                </View>
              ))}
            </View>
          </View>
        </Card>
      </DoubleClick>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'left',
    color: 'black',
    margin: 0,
    padding: 0,
    fontSize: 16,
  },
  subtitle: {
    textAlign: 'left',
    color: gs.textSecondaryColor,
    margin: 0,
    padding: 0,
    fontSize: 10,
  },
})

export default ProfileCard;
