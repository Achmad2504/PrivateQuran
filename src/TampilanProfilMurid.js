import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {hijau_terang} from './color';
import Icon from 'react-native-vector-icons/AntDesign';
import {getToken, storeToken} from './constants';
import database from '@react-native-firebase/database';
import Choose from './Pages/Lokasi/Choose';
import DocumentPicker from 'react-native-document-picker';

export class TampilanProfilMurid extends Component {
  state = {
    loading: false,
    isEditNama: false,
    isEditAdress: false,
    isEditJK: false,
    isEditNoHp: false,
    isEditEmail: false,
    isEditHarga: false,
    user: {
      username: '',
      password: '',
      alamat: '',
      lat: null,
      lng: null,
      nama: '',
      phone: '',
      id: '',
      status: '',
      file: '',
    },
    location: {
      address: '',
      lat: null,
      lng: null,
    },
  };

  _saveLocation = async (loc) => {
    database()
      .ref(`/tb_register_murid/${this.state.user.id}`)
      .set({
        nama: this.state.user.nama,
        username: this.state.user.username,
        password: this.state.user.password,
        phone: this.state.user.phone,
        harga: this.state.user.harga,
        latitude: loc.lat,
        longitude: loc.lng,
        alamat: loc.address,
      })
      .then(() => {
        this._getProfilMurid();

        console.log('success save location');
      })
      .catch(() => {
        this.setState({loadingFile: false});
      });
  };

  attachFile = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      this.setState({file: res});
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  _getProfilMurid = async () => {
    const token = await getToken();
    this.setState({loading: true});
    database()
      .ref(`tb_register_murid/${token.token}`)
      .on('value', (snap) => {
        const p1 = snap.val();
        this.setState({loading: false});
        this.setState({
          user: {
            alamat: p1.alamat,
            lat: p1.latitude,
            lng: p1.longitude,
            nama: p1.nama,
            phone: p1.phone,
            id: snap.key,
            username: p1.username,
            password: p1.password,
            harga: p1.harga,
          },
          location: {
            address: p1.alamat,
            lat: p1.latitude,
            lng: p1.longitude,
          },
        });
      });
  };

  componentDidMount = async () => {
    this._getProfilMurid();
  };

  _editData = () => {
    const dataState = {
      alamat: this.state.user.alamat,
      lat: this.state.user.lat,
      lng: this.state.user.lng,
      nama: this.state.user.nama,
      phone: this.state.user.phone,
      id: this.state.user.id,
      username: this.state.user.username,
      password: this.state.user.password,
    };
    const data = {
      alamat: this.state.user.alamat,
      latitude: this.state.user.lat,
      longitude: this.state.user.lng,
      nama: this.state.user.nama,
      phone: this.state.user.phone,
      username: this.state.user.username,
      password: this.state.user.password,
    };
    const value = {
      level: 'murid',
      token: this.state.user.id,
      lat: this.state.user.lat,
      lng: this.state.user.lng,
      alamat: this.state.user.alamat,
      phone: this.state.user.phone,
      nama: this.state.user.nama,
      username: this.state.user.username,
      password: this.state.user.password,
    };

    database()
      .ref(`/tb_register_murid/${this.state.user.id}`)
      .set(data)
      .then(() => {
        this.setState({
          isEditNoHp: false,
          isEditNama: false,
          user: dataState,
        });
        storeToken(value);
        console.log('sucess edit data');
        // this.props.navigation.navigate('Login');
        // this.setState({loading: false});
      })
      .catch(() => {
        // this.setState({loading: false});
      });
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.state.loading ? (
          <View style={{marginTop: 36, flex: 1}}>
            <ActivityIndicator color={'rgba(0,0,0,0.4)'} size={'large'} />
          </View>
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={this._getProfilMurid}
              />
            }>
            <View style={styles.body}>
              <Image
                style={styles.stretch}
                source={require('./aseets/image.png')}
              />
              <Text style={styles.text}>{this.state.user.nama}</Text>
            </View>

            {this.state.isEditNama ? (
              <View style={styles.body3}>
                <TextInput
                  placeholder="Edit Nama"
                  value={this.state.user.nama}
                  onChangeText={(nama) =>
                    this.setState({user: {...this.state.user, nama}})
                  }
                />
                <View style={styles.body4}>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={this._editData}>
                    <Icon name={'check'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => this.setState({isEditNama: false})}>
                    <Icon name={'close'} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.body2}>
                <Text>Nama : {this.state.user?.nama}</Text>
                <TouchableOpacity
                  onPress={() => this.setState({isEditNama: true})}>
                  <Icon name={'edit'} />
                </TouchableOpacity>
              </View>
            )}

            {this.state.isEditNoHp ? (
              <View style={styles.body3}>
                <TextInput
                  keyboardType={'phone-pad'}
                  placeholder="Edit No.Hp"
                  value={this.state.user.phone}
                  onChangeText={(phone) =>
                    this.setState({user: {...this.state.user, phone}})
                  }
                />
                <View style={styles.body4}>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={this._editData}>
                    <Icon name={'check'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => this.setState({isEditNoHp: false})}>
                    <Icon name={'close'} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.body2}>
                <Text>No. Hp : {this.state.user?.phone}</Text>
                <TouchableOpacity
                  onPress={() => this.setState({isEditNoHp: true})}>
                  <Icon name={'edit'} />
                </TouchableOpacity>
              </View>
            )}

            {/* <View style={styles.body2}>
          <Text>Alamat : {this.state.user.alamat}</Text>
        </View> */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderBottomWidth: 1,
              }}>
              <Text>Alamat : </Text>
              <Choose
                profile={true}
                navigation={this.props.navigation}
                location={this.state.location}
                saveLocation={(val) => this._saveLocation(val)}
                setLocation={(val) => this.setState({location: val})}
              />
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  stretch: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  body: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: hijau_terang,
  },
  body2: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body3: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    padding: 3,
  },
  body4: {
    top: 5,
  },
  text: {
    padding: 10,
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
    marginTop: 10,
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
});
export default TampilanProfilMurid;
