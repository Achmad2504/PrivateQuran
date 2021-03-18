import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {List, ListItem, Left, Body, Thumbnail, Right} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {white} from '../../color';
import {getToken} from '../../constants';
import database from '@react-native-firebase/database';

export class ListGuru extends Component {
  state = {
    loading: false,
  };

  _requestPemesanan = async () => {
    const data = this.props.nana;
    const token = await getToken();
    const id = Date.now();
    this.setState({loading: true});

    database()
      .ref(`tb_request_pemesanan/${data.id}/${token.token}`)
      .set({
        nama: this.props.profil.nama,
        dateRequest: id,
      })
      .then(() => {
        this.props.navigation.goBack(null);
        ToastAndroid.show(
          'Pemesanan Berhasil... Tunggu Guru Menerima Pesanan Anda.',
          ToastAndroid.LONG,
        );
        this.setState({loading: false});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  createTwoButtonAlert = () =>
    Alert.alert(
      'Pesan Guru',
      'Apakah anda ingin melakukan pemesanan?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this._requestPemesanan},
      ],
      {cancelable: false},
    );
  render() {
    return (
      <View>
        <View>
          <List>
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
                <Text>Harga : Rp. {this.props.nana?.harga}</Text>
                <Text>No_Hp: {this.props.nana.phone}</Text>
              </Body>
              <Right>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={this.createTwoButtonAlert}>
                  {this.state.loading ? (
                    <ActivityIndicator color={'#fff'} />
                  ) : (
                    <Text style={styles.txt}>Pesan</Text>
                  )}
                </TouchableOpacity>
              </Right>
            </ListItem>
          </List>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#15ED3C',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginTop: 20,
  },
  txt: {
    color: white,
    fontWeight: 'bold',
  },
});

export default ListGuru;
