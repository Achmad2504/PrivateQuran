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
    jarak: 0,
  };

  // toRad = (angle) => {
  //   return (angle * Math.PI) / 180;
  // };

  // //computer distance adalah sebuah metode berfungsi untuk menghitung jarak
  // computeDistance = (lat, lng) => {
  //   const latInRad = this.toRad(this.props.profil.latitude);
  //   const longInRad = this.toRad(this.props.profil.longitude);
  //   const prevLatInRad = this.toRad(lat);
  //   const prevLongInRad = this.toRad(lng);

  //   // In kilometers
  //   const res =
  //     6377.830272 *
  //     Math.acos(
  //       Math.sin(prevLatInRad) * Math.sin(latInRad) +
  //         Math.cos(prevLatInRad) *
  //           Math.cos(latInRad) *
  //           Math.cos(longInRad - prevLongInRad),
  //     );

  //   return res;
  // };

  _requestPemesanan = async () => {
    const data = this.props.nana;
    const token = await getToken();
    const id = Date.now();
    this.setState({loading: true});
    const body = {
      nama: this.props.profil.nama,
      alamat: this.props.profil.alamat,
      phone: this.props.profil.phone,
      Jasa: this.props.profil.Jasa,
      jadwal: this.props.profil.jadwal,
      jarak: this.computeDistance(
        this.props.nana.latitude,
        this.props.nana.longitude,
      ),
      dateRequest: id,
    };

    database()
      .ref(`tb_request_pemesanan/${data.id}/${token.token}`)
      .set(body)
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
                <Text>Jasa/Hari: Rp. {this.props.nana?.Jasa}</Text>
                <Text>No_Hp: {this.props.nana.phone}</Text>
                <Text>Jadwal: {this.props.nana.jadwal}</Text>
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
