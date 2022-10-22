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
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={gs.dividerMedium} />
        <View style={gs.dividerLight} />
        <View style={this.props.isFocused ? styles.commentBox : styles.commentBoxNotFocused}>
          <View>
            <View style={styles.commentTitleBox}>
              <Text style={{fontWeight: 'bold'}}>{this.state.firstname + "  "}</Text>
              <Text style={[gs.subtitle, styles.subtitle]}>{convertTimestamp(this.state.timestamp)}</Text>
            </View>
            <Text style={styles.commentText}>{this.state.text}</Text>
          </View>
          {this.state.userId === auth.currentUser.uid && this.props.isFocused ?
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

const styles = StyleSheet.create({
  commentBox: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  commentBoxNotFocused: {
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
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

export default CommentBox;
