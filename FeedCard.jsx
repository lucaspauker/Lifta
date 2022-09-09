import React from 'react';
import { TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from './database/firebase';
import { limit, addDoc, deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';

import gs from './globalStyles.js';
import Loading from './Loading';

function convertTimestamp(t) {
  let a = new Date(t);
  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let day = days[a.getDay()];
  let localeString = a.toLocaleString('en-US');
  let date = localeString.split(',')[0];
  let time = localeString.split(',')[1];
  let firstTime = time.split(':').slice(0, 2).join(':');
  let lastTime = time.split(' ')[2];
  return day + ', ' + date + ' @ ' + firstTime + ' ' + lastTime;
}

const workoutCodes = {
  "squat": "Squat",
  "bench": "Bench",
  "deadlift": "Deadlift",
  "ohp": "Overhead Press",
  "": "No name",
}

class FeedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: 0,
      liked: false,
      likeKey: '',
      username: '',
      firstname: '',
      lastname: '',
      id: '',
    }
  }

  likePost = () => {
    console.log(this.props.item);
    if (this.state.liked) {
      console.log(this.state.likeKey);
      deleteDoc(doc(db, 'likes', this.state.likeKey)).then(() => {
        this.setState({
          liked: false,
          likes: this.state.likes - 1,
          likeKey: '',
        });
      });
    } else {
      addDoc(collection(db, 'likes'), {
        user: auth.currentUser.uid,
        post: this.props.item.key,
      }).then((docRef) => {
        this.setState({
          liked: true,
          likes: this.state.likes + 1,
          likeKey: docRef.id,
        });
      });
    }
  }

  componentDidMount() {
    // Get username
    getDoc(doc(db, "users", this.props.item.user)).then((res) => {
      if (res.data()) {
        const id = String(res._key).split('/')[1];
        this.setState({username: res.data().username, firstname: res.data().firstname, lastname: res.data().lastname, id: id});
      }
    });

    // Get likes
    const q = query(collection(db, "likes"), where("post", "==", this.props.item.key));
    getDocs(q).then((res) => {
      this.setState({likes: res.size});
    });

    const qq = query(collection(db, "likes"), where("post", "==", this.props.item.key), where("user", "==", auth.currentUser.uid), limit(1));
    getDocs(qq).then((res) => {
      if (!res.empty) {
        const key = String(res.docs[0]._key).split('/')[1];
        this.setState({liked: true, likeKey: key});
      }
    });
  }

  render() {
    const item = this.props.item;
    return (
      <Card key={item.timestamp} containerStyle={gs.card}>
        <View style={gs.topsection}>
          <View style={styles.titlebar}>
            <Text style={styles.title} onPress={() => this.props.navigation.navigate('UserPage', {id: this.state.id})}>
              <Ionicons name="person-circle-outline" style={styles.title}/>
              &nbsp;{this.state.firstname + " " + this.state.lastname}
            </Text>
            <Text style={styles.subtitle}>
              <Ionicons name="barbell-outline" size={10} style={styles.titleText}/>
              &nbsp;{convertTimestamp(item.timestamp)}
            </Text>
          </View>
          <Text style={[styles.title, styles.workoutTitle]}>{item.title}</Text>
        </View>
        <View style={gs.workouts}>
          {Object.values(item.data).map((workout, i) => (
            <View key={i}>
              <View style={gs.workout}>
                <Text style={gs.workoutTitle}>
                  {workoutCodes[workout.workout]}
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
          <TouchableOpacity style={styles.likes} onPress={this.likePost}>
            <Text>
              {this.state.liked ?
                <Ionicons name="heart" size={20} color={gs.backgroundColor} />
                :
                <Ionicons name="heart-outline" size={20} color={gs.backgroundColor} />
              }
            </Text>
            <Text style={styles.likeText}>{this.state.likes} likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={gs.clearButton} onPress={() => {}}>
            <Ionicons name="chatbox-outline" size={20} color={gs.backgroundColor} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    fontSize: 30,
  },
  body: {
    textAlign: 'center',
  },
  button: {
    padding: 0,
    marginBottom: 0,
  },
  likes: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    textAlign: 'left',
    color: 'black',
    margin: 0,
    padding: 0,
    fontSize: 16,
  },
  subtitle: {
    color: gs.textSecondaryColor,
    margin: 0,
    padding: 0,
    fontSize: 10,
  },
  titlebar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitle: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  likeText: {
    margin: 0,
    padding: 0,
    fontSize: 10,
  },
})

export default FeedCard;
