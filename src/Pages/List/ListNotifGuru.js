import React, {Component} from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import {Body, Left, List, ListItem, Right, Thumbnail} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {white} from '../../color';

export class ListNotifGuru extends Component {
  createTwoButtonAccept = () =>
    Alert.alert('Notifikasi', 'Anda telah menerima pemesanan.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  createTwoButtonCancel = () =>
    Alert.alert('Notifikasi', 'Anda telah membatalkan pemesanan.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);

  render() {
    return (
      <View>
        <List>
          <ListItem avatar>
            <Left style={styles.image}>
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
              <Text>Jarak: {this.props.nana.jarak.toFixed(2)} km</Text>
            </Body>
            <Right>
              <TouchableOpacity
                style={styles.btn1}
                onPress={this.props.onPress}>
                <Text>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btn2}
                onPress={this.createTwoButtonCancel}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </Right>
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
    marginTop: 8,
  },
  btn2: {
    backgroundColor: '#15ED3C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 5,
  },
  txt: {
    color: white,
    fontWeight: 'bold',
  },
  child: {
    marginTop: 15,
  },
  image: {
    marginTop: 10,
  },
});

export default ListNotifGuru;
