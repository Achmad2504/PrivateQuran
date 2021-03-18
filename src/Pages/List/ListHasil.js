import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {List, ListItem} from 'native-base';

export class ListHasil extends Component {
  render() {
    return (
      <View>
        <List>
          <ListItem>
            <Text>{this.props.rijal.title}</Text>
          </ListItem>
        </List>
      </View>
    );
  }
}

export default ListHasil;
