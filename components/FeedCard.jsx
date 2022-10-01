import React from 'react';
import { TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Text, View, TextInput } from 'react-native';
import { Card, Button } from "@rneui/base";
import { signOut } from 'firebase/auth';
import { db, auth, provider } from '../database/firebase';
import { limit, addDoc, deleteDoc, doc, collection, query, where, getDocs, getDoc, orderBy } from "firebase/firestore";
import DoubleClick from 'react-native-double-tap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';

import gs from './globalStyles.js';
import {toTitleCase, convertTimestamp} from './utils.js';
import Loading from './Loading';
import CustomIcon from './CustomIcon';

class FeedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likes: 0,
      comments: 0,
      liked: false,
      likeKey: '',
      username: '',
      firstname: '',
      lastname: '',
      id: '',
    }
  }

  clickCommentButton = () => {
    this.props.navigation.navigate('Workout', {id: this.props.item.key, userId: this.state.id})
  }

  likePost = () => {
    if (this.state.liked) {
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

    // Get comments
    const qqq = query(collection(db, "comments"), where("postId", "==", this.props.item.key));
    getDocs(qqq).then((res) => {
      this.setState({comments: res.size});
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
      <DoubleClick
        singleTap={() => {
          this.props.navigation.navigate('Workout', {id: item.key, userId: this.state.id})
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
                  <Text style={gs.title} onPress={() => this.props.navigation.navigate('UserPage', {id: this.state.id})}>
                    {this.state.firstname + " " + this.state.lastname + "'s " + item.title}
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
                <TouchableOpacity style={styles.likes} onPress={this.likePost}>
                  <Text>
                    {this.state.liked ?
                      <Ionicons name="heart" size={36} color={gs.backgroundColor} />
                      :
                      <Ionicons name="heart-outline" size={36} color={gs.backgroundColor} />
                    }
                  </Text>
                  <Text style={styles.likeText}>{this.state.likes} likes</Text>
                </TouchableOpacity>
                {this.props.isFocused ?
                  '' :
                  <TouchableOpacity style={styles.likes} onPress={this.clickCommentButton}>
                    <Ionicons name="chatbox-outline" size={36} color={gs.backgroundColor} />
                    <Text style={styles.likeText}>{this.state.comments} comments</Text>
                  </TouchableOpacity>
                }
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
                      {workout.workout ? toTitleCase(workout.workout) : 'Workout'}
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
          <View style={gs.dividerPink} />
        </Card>
      </DoubleClick>
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
  workoutTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: "SourceSansPro_700Bold",
  },
  likeText: {
    margin: 0,
    padding: 0,
    fontSize: 10,
    fontFamily: gs.bodyFont,
  },
})

export default FeedCard;
