import React, {Component} from 'react';
import {Pressable, Text, View} from 'react-native';
import {List, ListItem, Left, Body, Right, Thumbnail} from 'native-base';

export class ListMurid extends Component {
  render() {
    return (
      <View>
        <List onTouchStart={this.props.onPress}>
          <ListItem avatar>
            <Left>
              <Thumbnail
                source={{
                  uri: this.props.nana.photo,
                }}
              />
            </Left>
            <Body>
              <Text>Nama : {this.props.nana.nama}</Text>
              <Text>Alamat : {this.props.nana.alamat}</Text>
              <Text>No_Hp: {this.props.nana.phone}</Text>
            </Body>
          </ListItem>
        </List>
      </View>
    );
  }
}

export default ListMurid;
