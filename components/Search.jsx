import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SearchBar } from '@rneui/themed';
import gs from './globalStyles.js';

class Search extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <View style={styles.container}>
        <SearchBar
          round
          lightTheme
          showCancel
          placeholder="Search for friends"
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={styles.searchbar}
        />
        <View style={styles.results}>
          <Text style={styles.header}>ome!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    padding: 10,
    height: '100%',
  },
  results: {
    marginTop: 30,
  },
  searchbar: {
    padding: 0,
    margin: 0,
    border: 0,
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  header: {
    fontSize: 30,
  }
})

export default Search;
