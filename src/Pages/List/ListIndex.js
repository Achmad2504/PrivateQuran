import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {white} from '../../color';
import database from '@react-native-firebase/database';

export class ListIndex extends Component {
  data = this.props.nana;

  state = {
    loading: false,
    loadingApprove: false,
    loadingReject: false,
  };

  _approve = () => {
    this.setState({loadingApprove: true});
    database()
      .ref(`/tb_register_guru/${this.data.id}`)
      .set({
        nama: this.data.nama,
        username: this.data.username,
        password: this.data.password,
        phone: this.data.phone,
        harga: this.data.harga,
        jadwal: this.data.jadwal,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        alamat: this.data.alamat,
        file: this.data.file,
        status: 'approved',
      })
      .then(() => {
        ToastAndroid.showWithGravity(
          `Berhasil Approve SK Mengaji ${this.data.nama}`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        this.setState({loadingApprove: true});
      })
      .catch(() => {
        this.setState({loadingApprove: true});
      });
  };

  _reject = () => {
    this.setState({loadingApprove: true});
    database()
      .ref(`/tb_register_guru/${this.data.id}`)
      .set({
        nama: this.data.nama,
        username: this.data.username,
        password: this.data.password,
        phone: this.data.phone,
        harga: this.data.harga,
        jadwal: this.data.jadwal,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        alamat: this.data.alamat,
        file: this.data.file,
        status: 'rejected',
      })
      .then(() => {
        ToastAndroid.showWithGravity(
          `SK Mengaji ${this.data.nama} Ditolak`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        this.setState({loadingApprove: true});
      })
      .catch(() => {
        this.setState({loadingApprove: true});
      });
  };

  render() {
    return (
      <View>
        <View style={styles.body}>
          <View>
            <Text style={styles.txt1}>{this.props.nana.nama}</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('PDFView', {
                  item: this.props.nana,
                })
              }
              style={[styles.btn, {backgroundColor: 'skyblue'}]}>
              <Text style={styles.txt}>Lihat SK Guru Mengaji</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={this._approve}
              style={[styles.btn, {backgroundColor: '#15ED3C'}]}>
              {this.state.loadingApprove ? (
                <ActivityIndicator color={'#fff'} />
              ) : (
                <Text style={styles.txt}>Approve</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: 'red'}]}
              onPress={this._reject}>
              {this.state.loadingReject ? (
                <ActivityIndicator color={'#fff'} />
              ) : (
                <Text style={styles.txt}>Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            marginBottom: 20,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#15ED3C',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 50,
    marginBottom: 5,
    alignItems: 'center',
  },
  txt: {
    color: white,
    // fontWeight: 'bold',
  },
  txt1: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default ListIndex;
