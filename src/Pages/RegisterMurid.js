import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {black, white} from '../color';
import UUIDGenerator from 'react-native-uuid-generator';
import database from '@react-native-firebase/database';
import Choose from './Lokasi/Choose';

export class RegisterMurid extends Component {
  state = {
    nama: '',
    username: '',
    password: '',
    konf_pass: '',
    phone: '',
    loading: false,
    location: null,
  };

  _addMurid = async () => {
    const userid = await UUIDGenerator.getRandomUUID();
    database()
      .ref(`/tb_register_murid/${userid}`)
      .set({
        nama: this.state.nama,
        username: this.state.username,
        password: this.state.password,
        phone: this.state.phone,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng,
        alamat: this.state.location.address,
      })
      .then(() => {
        this.props.navigation.navigate('Login');
        this.setState({loading: false});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  _registerMurid = () => {
    if (!this.state.nama) {
      alert('Nama tidak boleh kosong');
      return;
    }
    if (!this.state.username) {
      alert('Username tidak boleh kosong');
      return;
    }
    if (!this.state.phone) {
      alert('nomor telepon tidak boleh kosong');
      return;
    }

    if (!this.state.password) {
      alert('Password tidak boleh kosong');
      return;
    }
    if (this.state.password !== this.state.konf_pass) {
      alert('password tidak sama');
      return;
    }
    if (!this.state.location) {
      alert('Silahkan pilih lokasi terlebih dahulu');
      return;
    }

    this.setState({loading: true});
    database()
      .ref('/tb_register_murid')
      .once('value')
      .then((snap) => {
        if (!!snap) {
          this._addMurid();
        } else {
          let arr = Object.values(snap.val());
          let filterArr = arr.filter((i) => i.username === this.state.username);
          if (filterArr.length === 0) {
            this._addMurid();
          } else {
            this.setState({loading: false});
            alert('Username sudah digunakan');
          }
        }
      });
  };
  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <View style={styles.container}>
            <ImageBackground
              source={require('../aseets/splash.png')}
              style={styles.image}>
              <ScrollView>
                <View>
                  <Text style={styles.Header}>L - Private Qur'an</Text>
                </View>
                <View style={styles.child1}>
                  <TextInput
                    value={this.state.nama}
                    onChangeText={(value) => this.setState({nama: value})}
                    placeholder={'Masukan Nama Lengkap'}
                    style={styles.input}></TextInput>
                  <TextInput
                    value={this.state.username}
                    onChangeText={(value) => this.setState({username: value})}
                    placeholder={'Masukan Username'}
                    style={styles.input}></TextInput>
                  <TextInput
                    keyboardType={'phone-pad'}
                    value={this.state.phone}
                    onChangeText={(value) => this.setState({phone: value})}
                    placeholder={'Masukan Nomor telepon'}
                    style={styles.input}></TextInput>
                  <TextInput
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(value) => this.setState({password: value})}
                    placeholder={'Masukan Password'}
                    style={styles.input}></TextInput>
                  <TextInput
                    secureTextEntry={true}
                    value={this.state.konf_pass}
                    onChangeText={(value) => this.setState({konf_pass: value})}
                    placeholder={'Konfirmasi Password'}
                    style={styles.input}></TextInput>
                  <Choose
                    location={this.state.location}
                    navigation={this.props.navigation}
                    setLocation={(val) => this.setState({location: val})}
                  />
                </View>
                <View>
                  <TouchableOpacity
                    onPress={this._registerMurid}
                    style={styles.btn1}>
                    {this.state.loading ? (
                      <ActivityIndicator color={'black'} />
                    ) : (
                      <Text>Registrasi</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  Header: {
    color: black,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  input: {
    backgroundColor: '#D5F5E3',
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    color: black,
  },
  child1: {
    padding: 20,
  },
  txfile: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  txsurat: {
    fontSize: 9,
    paddingHorizontal: 35,
  },
  btn: {
    backgroundColor: '#2ECC71',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginLeft: 100,
  },
  child2: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 10,
  },
  btn1: {
    backgroundColor: '#2ECC71',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 80,
    marginTop: 50,
    borderRadius: 50,
    alignItems: 'center',
  },
});

export default RegisterMurid;
