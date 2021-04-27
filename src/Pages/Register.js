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
import storage from '@react-native-firebase/storage';
import Choose from './Lokasi/Choose';
import DocumentPicker from 'react-native-document-picker';

export class Register extends Component {
  state = {
    nama: '',
    username: '',
    password: '',
    konf_pass: '',
    phone: '',
    harga: '',
    jadwal: '',
    loading: false,
    location: null,
    file: null,
  };
  _registerguru = async () => {
    const userid = await UUIDGenerator.getRandomUUID();
    if (!this.state.nama) {
      alert('Nama tidak boleh kosong');
      return;
    }
    if (!this.state.username) {
      alert('Username tidak boleh kosong');
      return;
    }
    if (!this.state.phone) {
      alert('Nomor telepon tidak boleh kosong');
      return;
    }
    if (!this.state.password) {
      alert('Password tidak boleh kosong');
      return;
    }
    if (!this.state.harga) {
      alert('Harga tidak boleh kosong');
      return;
    }
    if (this.state.password !== this.state.konf_pass) {
      alert('password tidak sama');
      return;
    }
    if (this.state.jadwal !== this.state.jadwal) {
      alert('jadwal tidak boleh kosong');
      return;
    }
    if (!this.state.location) {
      alert('Silahkan pilih lokasi terlebih dahulu');
      return;
    }
    if (!this.state.file) {
      alert('Silahkan upload file (SK guru mengaji).');
      return;
    }

    this.setState({loading: true});
    // upload file to storage
    const response = await fetch(this.state.file.uri);
    const blob = await response.blob();
    const name = this.state.file.name;
    const now = new Date().getTime();

    var ref = storage().ref().child('file').child(`${name}_${now}`);

    ref.put(blob).then(() => {
      ref.getDownloadURL().then((url) => {
        // save data to database
        database()
          .ref('/tb_register_guru')
          .once('value')
          .then((snap) => {
            let arr = snap.val() ? Object.values(snap.val()) : [];
            let filterArr = arr.filter(
              (i) => i.username === this.state.username,
            );
            if (filterArr.length === 0) {
              //proses pembuatan tabel pada database
              database()
                .ref(`/tb_register_guru/${userid}`)
                .set({
                  nama: this.state.nama,
                  username: this.state.username,
                  password: this.state.password,
                  phone: this.state.phone,
                  harga: this.state.harga,
                  jadwal: this.state.jadwal,
                  latitude: this.state.location.lat,
                  longitude: this.state.location.lng,
                  alamat: this.state.location.address,
                  file: url,
                  status: 'pending',
                })
                .then(() => {
                  this.props.navigation.navigate('Login');
                  this.setState({loading: false});
                })
                .catch(() => {
                  this.setState({loading: false});
                });
            } else {
              this.setState({loading: false});
              alert('Username sudah digunakan');
            }
          });
      });
    });
  };

  attachFile = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      this.setState({file: res});
      console.log(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
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
                  <TextInput
                    value={this.state.harga}
                    onChangeText={(value) => this.setState({harga: value})}
                    placeholder={'Masukkan Harga'}
                    style={styles.input}></TextInput>
                  <TextInput
                    value={this.state.jadwal}
                    onChangeText={(value) => this.setState({jadwal: value})}
                    placeholder={'Masukkan Jadwal mengajar (Hari)'}
                    style={styles.input}></TextInput>
                  <Choose
                    location={this.state.location}
                    navigation={this.props.navigation}
                    setLocation={(val) => this.setState({location: val})}
                  />
                </View>
                <View style={styles.child2}>
                  <Text style={styles.txfile}>Upload File : </Text>
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={this.attachFile}>
                    <Text>Browse</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.txsurat}>*SK Guru Mengaji </Text>
                </View>
                {this.state.file ? (
                  <View style={{marginHorizontal: 30, marginTop: 10}}>
                    <Text style={{color: 'cornflowerblue', fontWeight: 'bold'}}>
                      {this.state.file?.name}
                    </Text>
                  </View>
                ) : null}
                <View>
                  <TouchableOpacity
                    onPress={this._registerguru}
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

export default Register;
