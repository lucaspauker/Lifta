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

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      text: this.props.text,
      timestamp: this.props.timestamp,
      commentId: this.props.commentId,
      username: '',
      firstname: '',
      lastname: '',
      isLoading: true,
    }
  }

  deleteComment = () => {
    this.setState({isLoading: true});
    deleteDoc(doc(db, "comments", this.state.commentId)).then(() => {
      this.props.reload();
    });
  }

  componentDidMount() {
    getDoc(doc(db, "users", this.props.userId)).then((res) => {
      if (res.data()) {
        this.setState({username: res.data().username, firstname: res.data().firstname, lastname: res.data().lastname, isLoading: false});
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <View style={gs.dividerMedium} />
          <View style={gs.dividerLight} />
          <View style={styles.commentBox}>
            <View>
              <View style={[styles.commentTitleBox, styles.spaceBottom]}>
                <Text style={[{fontWeight: 'bold'}, gs.greyedOutText]}>
                  ........................
                </Text>
                <Text style={[gs.subtitle, styles.subtitle, styles.spaceLeft, gs.greyedOutText]}>
                  .....................
                </Text>
              </View>
              <Text style={[styles.commentText, gs.greyedOutText]}>
                ...........................................................
              </Text>
            </View>
            {this.state.userId === auth.currentUser.uid ?
              <TouchableOpacity onPress={() => {this.deleteComment()}}>
                <Ionicons name="trash-outline" size={16} color={gs.backgroundColor} />
              </TouchableOpacity>
              :
              ''
            }
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={gs.dividerMedium} />
        <View style={gs.dividerLight} />
        <View style={styles.commentBox}>
          <View>
            <View style={styles.commentTitleBox}>
              <Text style={{fontWeight: 'bold'}}>{this.state.firstname + " " + this.state.lastname + "  "}</Text>
              <Text style={gs.subtitle}>{convertTimestamp(this.state.timestamp)}</Text>
            </View>
            <Text style={styles.commentText}>{this.state.text}</Text>
          </View>
          {this.state.userId === auth.currentUser.uid ?
            <TouchableOpacity onPress={() => {this.deleteComment()}}>
              <Ionicons name="trash-outline" size={16} color={gs.backgroundColor} />
            </TouchableOpacity>
            :
            ''
          }
        </View>
      </View>
    );
  }
}

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
          <View style={gs.pageContainer}>
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
              <TouchableOpacity style={[gs.button, styles.button]} onPress={this.submitComment}>
                <Text style={gs.buttonText}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.state.comments.map((item, i) => (
            <CommentBox key={item.key} text={item.text} timestamp={item.timestamp} userId={item.userId} commentId={item.key} reload={this.reloadComments}/>
          ))}
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
    width: 80,
    marginRight: 5,
  },
  inputComment: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

