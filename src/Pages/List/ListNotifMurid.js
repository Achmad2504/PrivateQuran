import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Body, Left, List, ListItem, Right, Thumbnail} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {white} from '../../color';

export class ListNotifMurid extends Component {
  render() {
    return (
      <View>
        <List>
          <ListItem>
            <Text>{this.props.nana.message}</Text>
          </ListItem>
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn1: {
    backgroundColor: '#15ED3C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },
  btn2: {
    backgroundColor: '#15ED3C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 10,
  },
  txt: {
    color: white,
    fontWeight: 'bold',
  },
});

export default ListNotifMurid;
