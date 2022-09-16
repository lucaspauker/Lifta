import React from 'react';
import { Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from '../database/firebase';
import {deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';

import gs from './globalStyles.js';
import {toTitleCase, convertTimestamp, formatBigNumber} from './utils.js';
import Loading from './Loading';

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
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
      <Card key={item.timestamp} containerStyle={gs.card}>
        <View style={gs.topsection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            <Ionicons name="barbell-outline" size={10} style={styles.titleText}/>
            &nbsp;{convertTimestamp(item.timestamp)}
          </Text>
        </View>
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
          {item.notes ? <Text style={gs.notes}>{item.notes}</Text> : ''}
        </View>
        <View style={gs.buttons}>
          <TouchableOpacity style={gs.clearButton} onPress={() => {this.deleteEntry(item.key)}}>
            <Ionicons name="trash-outline" size={20} color={gs.backgroundColor} />
          </TouchableOpacity>
          <TouchableOpacity style={gs.clearButton} onPress={() => {this.editEntry(item.key)}}>
            <Ionicons name="create-outline" size={20} color={gs.backgroundColor} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}

class ProfileWorkouts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isLoading: true,
      data: [],
      totalWorkouts: 0,
      lbLifted: 0,
    };
  }

  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.replace('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  reload = () => {
    console.log("Loading data");
    let data = [];
    this.setState({isLoading: true});
    console.log(auth.currentUser.uid);
    const q = query(collection(db, "workouts"), where('user', '==', auth.currentUser.uid));
    getDocs(q).then((res) => {
      let lbLifted = 0;
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        data.push(id);
        Object.keys(id.data).forEach((w) => {
          lbLifted += id.data[w].reps * id.data[w].sets * id.data[w].weight;
        });
      });
      //console.log(data);
      data.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({data: data, isLoading: false, totalWorkouts: data.length, lbLifted: formatBigNumber(lbLifted)});
    });
  }

  componentDidMount() {
    this.reload();
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      if (res.data()) {
        this.setState({name: res.data().firstname});
      }
    });
  }

  render() {
    if (this.state.isLoading){
      return(
        <Loading/>
      );
    }
    return (
      <ScrollView>
        <View style={gs.pageContainer}>
          <View style={styles.stats}>
            <Text>
              Total workouts: {this.state.totalWorkouts}
            </Text>
            <Text>
              Pounds lifted: {this.state.lbLifted}
            </Text>
          </View>
          {this.state.data.map((item) => (
            <ProfileCard item={item} reload={this.reload} navigation={this.props.navigation} key={item.key}/>
          ))}
        </View>
      </ScrollView>
    );
  }
}

class ProfileSettings extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.params);
    this.state = {
      firstname: '',
      lastname: '',
      isLoading: true,
    };
  }

  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.replace('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }

  editProfile = () => {
    this.props.navigation.navigate('EditProfile');
  }

  componentDidMount() {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((res) => {
      if (res.data()) {
        this.setState({
          firstname: res.data().firstname,
          lastname: res.data().lastname,
          username: res.data().username,
          email: res.data().email,
          isLoading: false
        });
      }
    });
  }

  render() {
    if (this.state.isLoading){
      return(
        <Loading/>
      );
    }
    return (
      <ScrollView>
        <View style={gs.pageContainer}>
          <View style={styles.profileText}>
            <View style={styles.header}>
              <Text style={gs.pageHeader}>
                {this.state.firstname + " " + this.state.lastname}
              </Text>
              <Text style={[gs.pageHeader, styles.userName]}>
                @{this.state.username}
              </Text>
            </View>
            <Text style={[styles.email]}>
              {this.state.email}
            </Text>
          </View>
          <Button
            style={[gs.button, styles.button]}
            color={gs.backgroundColor}
            title="Edit Profile"
            onPress={() => this.editProfile()}
          />
          <Button
            style={[gs.button, styles.button]}
            color={gs.backgroundColor}
            title="Log Out"
            onPress={() => this.signOut()}
          />
        </View>
      </ScrollView>
    );
  }
}

const totalWidth = Dimensions.get("window").width;

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: gs.secondaryColor, width: totalWidth/2 - 40, left: 20 }}
    style={styles.tabbar}
    tabStyle={styles.tab}
    activeColor={gs.secondaryColor}
    inactiveColor={gs.textSecondaryColor}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color, margin: 0, fontSize: 16 }}>
        {route.title}
      </Text>
    )}
  />
);

function Profile({route, navigation}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Workouts' },
    { key: 'second', title: 'Profile' },
  ]);

  return (
    <TabView
      navigation={navigation}
      navigationState={{ index, routes }}
      renderScene={
        SceneMap({
          first: () => <ProfileWorkouts navigation={navigation}/>,
          second: () => <ProfileSettings navigation={navigation} params={route.params}/>,
        })
      }
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: totalWidth }}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    color: gs.textSecondaryColor,
  },
  email: {
    color: gs.textSecondaryColor,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  profileText: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 30,
  },
  body: {
    textAlign: 'center',
  },
  stats: {
    fontSize: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
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
  tabbar: {
    backgroundColor: gs.lightBackgroundColor,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  tab: {
    fontSize: 10,
  },
})

export default Profile;
