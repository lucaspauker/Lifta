import React from 'react';
import { RefreshControl, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { db, auth, provider } from '../database/firebase';
import {deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import { BarChart, LineChart } from "react-native-chart-kit";
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
      lastWeekDays: [],
      lastWeekWeights: [],
    }
  }

  reload = () => {
    console.log("Loading data");
    this.setState({isLoading: true});

    let data = [];
    let workoutDictionary = {};
    let workouts = new Set();
    let lastWeekDays = [];
    let dayWeightsDict = {};
    let lastTimestamp = -1;
    const q = query(collection(db, "workouts"), where('user', '==', auth.currentUser.uid));
    // Add the week days into the dictionary
    let d = new Date();
    for (let i=0; i<7; i++) {
      let datestring = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear().toString().slice(2);
      lastWeekDays.push(datestring);
      d.setDate(d.getDate() - 1);
    }
    lastWeekDays = lastWeekDays.reverse();

    getDocs(q).then((res) => {
      res.forEach((item) => {
        let id = item.data();

        id["key"] = String(item._key).split('/')[1];

        data.push(id);
        let weightLifted = 0;
        Object.keys(id.data).forEach((w) => {
          let workout = id.data[w].workout;
          let elem = id.data[w];
          elem.weight = parseInt(elem.weight);
          let key = elem.sets + 'x' + elem.reps;
          weightLifted += elem.sets * elem.reps * elem.weight;
          workouts.add(workout);
          if (workout in workoutDictionary) {
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

        let d = new Date(id.timestamp);
        let datestring = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear().toString().slice(2);
        if (lastWeekDays.includes(datestring)) {
          if (d in dayWeightsDict) {
            dayWeightsDict[datestring] += weightLifted;
          } else {
            dayWeightsDict[datestring] = weightLifted;
          }
        }
      });
      let lastWeekWeights = [];
      for (let i=0; i<7; i++) {
        if (lastWeekDays[i] in dayWeightsDict) {
          lastWeekWeights.push(dayWeightsDict[lastWeekDays[i]]);
        } else {
          lastWeekWeights.push(0);
        }
      }
      for (let i=0; i<[...workouts].length; i++) {
        let workout = [...workouts][i];
        let keys = Object.keys(workoutDictionary[workout]);
        for (let j=0; j<keys.length; j++) {
          // Sort by timestamp
          workoutDictionary[workout][keys[j]].sort((a, b) => a[1] - b[1]);
        }
      }
      workouts = [...workouts];
      workouts.sort()
      let firstKeys = Object.keys(workoutDictionary[workouts[0]]);
      firstKeys.sort((a, b) => workoutDictionary[workouts[0]][b].length - workoutDictionary[workouts[0]][a].length);
      let currentWorkout = workouts[0];
      data.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({
        workouts: workouts,
        currentWorkout: currentWorkout,
        currentSetsReps: firstKeys[0],
        workoutDictionary: workoutDictionary,
        lastWeekDays: lastWeekDays,
        lastWeekWeights: lastWeekWeights,
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
      let firstKeys = Object.keys(this.state.workoutDictionary[val]);
      firstKeys.sort((a, b) => this.state.workoutDictionary[val][b].length - this.state.workoutDictionary[val][a].length);
      this.setState({currentSetsReps: firstKeys[0]}, this.setState(state));
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
    workoutSetsReps.sort((a, b) => this.state.workoutDictionary[this.state.currentWorkout][b].length - this.state.workoutDictionary[this.state.currentWorkout][a].length);
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
          color: () => 'black',
          strokeWidth: 2
        }
      ],
    };
    const lastWeekData = {
      labels: this.state.lastWeekDays,
      datasets: [
        {
          data: this.state.lastWeekWeights,
          color: () => 'black',
          strokeWidth: 2
        }
      ],
    };
    return (
      <ScrollView
        style={{
          marginLeft: 10,
          marginRight: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            tintColor='white'
          />
        }>
        <View style={gs.dividerPink} />
        <View>
          <View style={[gs.labelBox, styles.labelBox, styles.headerBox]}>
            <Text style={styles.topLabel}>Pounds lifted over the past week</Text>
          </View>
          <View style={styles.chart}>
            <LineChart
              data={lastWeekData}
              width={Dimensions.get("window").width - 20}
              height={220}
              yAxisSuffix=" lb"
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: 'white',
                backgroundGradientFrom: 'white',
                backgroundGradientTo: gs.secondaryColorLight,
                decimalPlaces: 0,
                color: () => 'black',
                labelColor: () => 'black',
                style: {
                  borderRadius: 10,
                },
                propsForDots: {
                  r: "5",
                  strokeWidth: "0",
                  stroke: 'white',
                }
              }}
              style={{
                marginVertical: 1,
                borderRadius: 10,
              }}
              formatXLabel={(value) =>
                lastWeekData.labels[0] === value
                || lastWeekData.labels[2] === value
                || lastWeekData.labels[4] === value
                || lastWeekData.labels[6] === value
                ? value
                : ""
              }
            />
          </View>
          <View style={gs.dividerPink} />
          <View style={gs.dividerPink} />
          <View style={gs.dividerPink} />
          <View style={gs.curvedContainer}>
            <View style={[gs.labelBox, styles.labelBox, styles.headerBox]}>
              <Text style={styles.topLabel}>Graphs for specific workouts</Text>
            </View>
            <View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontal}>
                {workouts.map((item, i) => (
                  <TouchableOpacity key={i} onPress={() => this.updateInputVal(item, 'currentWorkout')}>
                    <View style={this.state.currentWorkout === item ? gs.darkCircleLabel : gs.circleLabel}>
                      <Text style={this.state.currentWorkout === item ? gs.darkCircleLabelText : gs.circleLabelText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horizontal}>
                {workoutSetsReps.map((item, i) => (
                  <TouchableOpacity key={i} onPress={() => this.updateInputVal(item, 'currentSetsReps')}>
                    <View style={this.state.currentSetsReps === item ? gs.darkCircleLabel : gs.circleLabel}>
                      <Text style={this.state.currentSetsReps === item ? gs.darkCircleLabelText : gs.circleLabelText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
        <View style={styles.chart}>
          <LineChart
            data={data}
            width={Dimensions.get("window").width - 20}
            height={220}
            yAxisSuffix=" lb"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: 'white',
              backgroundGradientFrom: 'white',
              backgroundGradientTo: gs.secondaryColorLight,
              decimalPlaces: 0,
              color: () => 'black',
              labelColor: () => 'black',
              style: {
                borderRadius: 10,
              },
              propsForDots: {
                r: "5",
                strokeWidth: "0",
                stroke: 'white',
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
  },
  pageContainer: {
    backgroundColor: gs.primaryColor,
    paddingTop: 0,
  },
  labelBox: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  topLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  topLabelBox: {
    padding: 5,
  },
  horizontal: {
  },
  headerBox: {
    justifyContent: 'center',
  },
})

export default Analytics;
