import React from 'react';
import { RefreshControl, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { db, auth, provider } from '../database/firebase';
import {deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import {convertTimestampCondensed} from './utils.js';

import {wait} from './utils.js';
import gs from './globalStyles.js';
import Loading from './Loading';

class Analytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      name: '',
      workouts: new Set([]),
      currentWorkout: '',
      currentSetsReps: '',
      workoutDictionary: {},
    }
  }

  reload = () => {
    console.log("Loading data");
    let data = [];
    this.setState({isLoading: true});
    const q = query(collection(db, "workouts"), where('user', '==', auth.currentUser.uid));
    getDocs(q).then((res) => {
      let workoutDictionary = this.state.workoutDictionary;
      let workouts = this.state.workouts;
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
        Object.keys(id.data).forEach((w) => {
          let workout = id.data[w].workout;
          let elem = id.data[w];
          elem.weight = parseInt(elem.weight);
          let key = elem.sets + 'x' + elem.reps;
          workouts.add(workout);
          if (workout in this.state.workoutDictionary) {
            if (key in workoutDictionary[workout]) {
              workoutDictionary[workout][key].push([elem.weight, id.timestamp]);
            } else {
              workoutDictionary[workout][key] = [[elem.weight, id.timestamp]];
            }
          } else {
            workoutDictionary[workout] = {}
            workoutDictionary[workout][key] = [[elem.weight, id.timestamp]];
          }
        });
      });
      for (let i=0; i<[...workouts].length; i++) {
        let workout = [...workouts][i];
        let keys = Object.keys(workoutDictionary[workout]);
        for (let j=0; j<keys.length; j++) {
          workoutDictionary[workout][keys[j]].sort((a, b) => a[1] - b[1]);
        }
      }
      workouts = [...workouts];
      workouts.sort()
      let firstKeys = Object.keys(workoutDictionary[workouts[0]]);
      let currentWorkout = workouts[0];
      data.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({
        workouts: workouts,
        currentWorkout: currentWorkout,
        currentSetsReps: firstKeys[0],
        workoutDictionary: workoutDictionary,
        data: data,
        isLoading: false,
        refreshing: false
      });
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true},
      () => {wait(100).then(() => this.reload())}
    );
  }

  componentDidMount() {
    this.reload();
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      if (res.data()) {
        this.setState({name: res.data().firstname});
      }
    });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    if (prop === 'currentWorkout') {
      this.setState({currentSetsReps: Object.keys(this.state.workoutDictionary[val])[0]}, this.setState(state));
    } else {
      this.setState(state);
    }
  }

  render() {
    if (this.state.isLoading){
      return(
        <Loading/>
      );
    }
    let workouts = this.state.workouts;
    let workoutSetsReps = Object.keys(this.state.workoutDictionary[this.state.currentWorkout]);
    workoutSetsReps.sort((a, b) => parseInt(a.split('x')[0]) - parseInt(b.split('x')[0]));
    let workoutData = this.state.workoutDictionary[this.state.currentWorkout][this.state.currentSetsReps];
    let workoutDates = [];
    let workoutWeights = [];
    for (let i=Math.max(0, workoutData.length - 5); i<workoutData.length; i++) {
      let d = convertTimestampCondensed(workoutData[i][1]);
      workoutDates.push(d);
      workoutWeights.push(workoutData[i][0]);
    }
    const data = {
      labels: workoutDates,
      datasets: [
        {
          data: workoutWeights,
          color: (opacity = 1) => 'white',
          strokeWidth: 2
        }
      ],
    };
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            tintColor='white'
          />
        }>
        <View style={gs.dividerPink} />
        <View style={gs.pageContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={gs.card, gs.labelBox}>
              {workouts.map((item, i) => (
                <TouchableOpacity key={i} onPress={() => this.updateInputVal(item, 'currentWorkout')}>
                  <View style={this.state.currentWorkout === item ? gs.darkCircleLabel : gs.circleLabel}>
                    <Text style={this.state.currentWorkout === item ? gs.darkCircleLabelText : gs.circleLabelText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={gs.card, gs.labelBox}>
              {workoutSetsReps.map((item, i) => (
                <TouchableOpacity key={i} onPress={() => this.updateInputVal(item, 'currentSetsReps')}>
                  <View style={this.state.currentSetsReps === item ? gs.darkCircleLabel : gs.circleLabel}>
                    <Text style={this.state.currentSetsReps === item ? gs.darkCircleLabelText : gs.circleLabelText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={gs.dividerPink} />
        </View>
        <View style={styles.chart}>
          <LineChart
            data={data}
            width={Dimensions.get("window").width - 10}
            height={220}
            yAxisSuffix=" lb"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: gs.secondaryColor,
              backgroundGradientFrom: gs.secondaryColor,
              backgroundGradientTo: gs.secondaryColor,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 10
              },
              propsForDots: {
                r: "5",
                strokeWidth: "3",
                stroke: gs.secondaryColor,
              }
            }}
            style={{
              marginVertical: 1,
              borderRadius: 10,
            }}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  chart: {
    marginLeft: 5,
    marginRight: 5,
  }
})

export default Analytics;
