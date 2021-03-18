import React, {Component} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {abuabu, black, blue, hijauarmy, white} from '../color';
import database from '@react-native-firebase/database';
import {storeToken} from '../constants';

export class Login extends Component {
  state = {
    username: '',
    password: '',
    loading: false,
  };

  _resetPassword = (email) => {
    console.log(email);
  };

  _toRegister = () => {
    this.props.navigation.navigate('Register');
  };
  _dbGuru = () => {
    if (!this.state.username) {
      alert('Username tidak boleh kosong');
      console.log('nana');
      return;
    }
    if (!this.state.password) {
      alert('Password tidak boleh kosong');
      return;
    }
    this.setState({loading: true});
    database()
      .ref('/tb_register_guru')
      .once('value')
      .then((snap) => {
        let arr = Object.values(snap.val());
        let keys = Object.keys(snap.val());

        for (const i in arr) {
          for (const j in keys) {
            if (i === j) arr[i]['id'] = keys[j];
          }
        }

        let filterArr = arr.filter((i) => i.username === this.state.username);
        if (filterArr.length === 0) {
          alert('User tidak ditemukan');
        } else {
          filterArr.map((i) => {
            if (i.password !== this.state.password) {
              alert('Password Tidak Cocok dengan username');
            } else {
              if (i?.level === 'admin') {
                const value = {
                  level: 'admin',
                  token: i.id,
                  username: i.username,
                  password: i.password,
                };
                storeToken(value);
                this.props.navigation.navigate('Admin');
              } else {
                const value = {
                  level: 'guru',
                  token: i.id,
                  lat: i.latitude,
                  lng: i.longitude,
                  alamat: i.alamat,
                  phone: i.phone,
                  nama: i.nama,
                  username: i.username,
                  password: i.password,
                  status: i.status,
                  file: i.file,
                };
                storeToken(value);
                this.props.navigation.navigate('dbGuru');
              }
            }
          });
        }
        this.setState({loading: false});
      });
  };
  _loginGuru = () => {};

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <ScrollView>
            <View style={styles.Header}>
              <Text style={styles.txHeader}>L - Private Qur'an</Text>
              <Image
                source={require('../aseets/logo.png')}
                style={styles.image}
              />
            </View>
            <View>
              <Text style={styles.txLogin}>Login</Text>
            </View>
            <View style={styles.child2}>
              <TextInput
                value={this.state.username}
                onChangeText={(val) => this.setState({username: val})}
                placeholder={'Masukkan Username'}
                style={styles.input}
              />
              <TextInput
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(val) => this.setState({password: val})}
                placeholder={'Masukkan Password'}
                style={styles.input}
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={this._dbGuru}>
              {this.state.loading ? (
                <ActivityIndicator color={'black'} />
              ) : (
                <Text style={styles.txBtn}>LOGIN</Text>
              )}
            </TouchableOpacity>
            <View style={styles.child3}>
              <Text style={styles.txCreate} onPress={this._toRegister}>
                Create Account
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: white,
  },
  Header: {
    flex: 1,
    backgroundColor: '#15ED3C',
    height: 250,
    alignItems: 'center',
    padding: 10,
  },
  child1: {
    alignItems: 'center',
    padding: 10,
  },
  child2: {
    paddingHorizontal: 16,
  },
  image: {
    width: 200,
    height: 200,
  },
  txLogin: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
  txHeader: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: white,
  },
  input: {
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    color: black,
  },
  btn: {
    backgroundColor: '#15ED3C',
    paddingVertical: 16,
    marginHorizontal: 72,
    marginVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  txBtn: {
    color: white,
    fontWeight: 'bold',
  },
  child3: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  txCreate: {
    color: blue,
    fontWeight: 'bold',
    fontSize: 16,
  },
  or: {
    color: black,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Login;
