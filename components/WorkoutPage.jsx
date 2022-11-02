import React from 'react';
import { Dimensions, TouchableOpacity, ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import {Card, Button} from "@rneui/base";
import { db, auth } from '../database/firebase';
import { deleteDoc, where, orderBy, getDocs, query, collection, getDoc, doc, addDoc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {convertTimestamp} from './utils.js';
import gs from './globalStyles.js';
import Loading from './Loading';
import FeedCard from './FeedCard';
import CommentBox from './CommentBox';

class WorkoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.id,
      userId: this.props.route.params.userId,
      username: '',
      firstname: '',
      lastname: '',
      commentText: '',
      comments: [],
      isLoading: true,
      item: null,
    }
  }

  reload = () => {
    this.setState({isLoading: true});
    let comments = [];
    const q = query(collection(db, "comments"), where('postId', '==', this.state.id));
    getDocs(q).then((res) => {
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        comments.push(id);
      });
      getDoc(doc(db, "users", this.state.userId)).then((res) => {
        if (res.data()) {
          this.setState({lastname: res.data().lastname, firstname: res.data().firstname, username: res.data().username});
        }
        getDoc(doc(db, "workouts", this.state.id)).then((res) => {
          if (res.data()) {
            let item = res.data();
            item.key = this.state.id;
            comments.sort((a, b) => b.timestamp - a.timestamp);
            this.setState({item: item, comments: comments, isLoading: false});
          }
        });
      });
    });
  }

  reloadComments = () => {
    let comments = [];
    const q = query(collection(db, "comments"), where('postId', '==', this.state.id));
    getDocs(q).then((res) => {
      res.forEach((item) => {
        let id = item.data();
        id["key"] = String(item._key).split('/')[1];
        comments.push(id);
      });
      comments.sort((a, b) => b.timestamp - a.timestamp);
      this.setState({comments: comments});
    });
  }

  componentDidMount() {
    this.reload();
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  submitComment = () => {
    console.log("Writing comment");
    addDoc(collection(db, 'comments'), {
      userId: auth.currentUser.uid,
      postId: this.state.id,
      text: this.state.commentText,
      timestamp: (new Date()).getTime(),
    }).then(() => {
      this.setState({
        commentText: '',
      });
      this.reloadComments();
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
        <FeedCard item={this.state.item} reload={this.reload} navigation={this.props.navigation} isFocused={true}/>
        <View>
          <View style={[gs.card, gs.curvedContainer]}>
            <View style={styles.inputComment}>
              <TextInput
                returnKeyType={ "done" }
                blurOnSubmit={ true }
                onSubmitEditing={() => {
                }}
                style={styles.input}
                onChangeText={(val) => this.updateInputVal(val, 'commentText')}
                value={this.state.commentText}
                placeholder="Add a comment..."
                placeholderTextColor={gs.textSecondaryColor}
              />
              <TouchableOpacity style={[gs.blueButton, styles.button]} onPress={this.submitComment}>
                <Text style={gs.blueButtonText}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
            {this.state.comments.map((item, i) => (
              <CommentBox key={item.key} text={item.text} timestamp={item.timestamp} userId={item.userId} commentId={item.key} reload={this.reloadComments} isFocused={true}/>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    padding: 10,
    borderWidth: 0,
    borderTopWidth: 0,
    width: Dimensions.get("window").width - 80 - 5,
  },
  button: {
    marginRight: 5,
  },
  inputComment: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  commentBox: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  commentTitleBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 0,
  },
  spaceLeft: {
    marginLeft: 10,
  },
  spaceBottom: {
    marginBottom: 10,
  },
})

export default WorkoutPage;

