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
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';

export class TampilanProfil extends Component {
  state = {
    loading: false,
    isEditNama: false,
    isEditAdress: false,
    isEditJK: false,
    isEditNoHp: false,
    isEditEmail: false,
    isEditHarga: false,
    isEditStatus: false,
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
    file: null,
    loadingFile: false,
  };

  _saveFile = async () => {
    this.setState({loadingFile: true});
    const response = await fetch(this.state.file.uri);
    const blob = await response.blob();
    const name = this.state.file.name;
    const now = new Date().getTime();

    var ref = storage().ref().child('file').child(`${name}_${now}`);

    ref.put(blob).then(() => {
      ref.getDownloadURL().then((url) => {
        // save data to database
        database()
          .ref(`/tb_register_guru/${this.state.user.id}`)
          .set({
            nama: this.state.user.nama,
            username: this.state.user.username,
            password: this.state.user.password,
            phone: this.state.user.phone,
            harga: this.state.user.harga,
            latitude: this.state.user.lat,
            longitude: this.state.user.lng,
            alamat: this.state.user.alamat,
            file: url,
            status: 'pending',
          })
          .then(() => {
            this._getProfilGuru();
            this.setState({loadingFile: false});
            console.log('success save file');
          })
          .catch(() => {
            console.log('error save file');
            this.setState({loadingFile: false});
          });
      });
    });
    // console.log(this.state.user);
  };

  _saveLocation = async (loc) => {
    database()
      .ref(`/tb_register_guru/${this.state.user.id}`)
      .set({
        nama: this.state.user.nama,
        username: this.state.user.username,
        password: this.state.user.password,
        phone: this.state.user.phone,
        harga: this.state.user.harga,
        latitude: loc.lat,
        longitude: loc.lng,
        alamat: loc.address,
        file: this.state.user.file,
        status: this.state.user.status,
      })
      .then(() => {
        this._getProfilGuru();

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

  _getProfilGuru = async () => {
    const token = await getToken();
    this.setState({loading: true});
    database()
      .ref(`tb_register_guru/${token.token}`)
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
            status: p1.status,
            file: p1.file,
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
    this._getProfilGuru();
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
      status: this.state.user.status,
      file: this.state.user.file,
      harga: this.state.user.harga,
    };
    const data = {
      alamat: this.state.user.alamat,
      latitude: this.state.user.lat,
      longitude: this.state.user.lng,
      nama: this.state.user.nama,
      phone: this.state.user.phone,
      username: this.state.user.username,
      password: this.state.user.password,
      status: this.state.user.status,
      file: this.state.user.file,
      harga: this.state.user.harga,
    };
    const value = {
      level: 'guru',
      token: this.state.user.id,
      lat: this.state.user.lat,
      lng: this.state.user.lng,
      alamat: this.state.user.alamat,
      phone: this.state.user.phone,
      nama: this.state.user.nama,
      username: this.state.user.username,
      password: this.state.user.password,
      status: this.state.user.status,
      file: this.state.user.file,
      harga: this.state.user.harga,
    };

    database()
      .ref(`/tb_register_guru/${this.state.user.id}`)
      .set(data)
      .then(() => {
        this.setState({
          isEditNoHp: false,
          isEditNama: false,
          user: dataState,
          isEditStatus: false,
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
                onRefresh={this._getProfilGuru}
              />
            }>
            <View style={styles.body}>
              <Image
                style={styles.stretch}
                source={require('./aseets/image.png')}
              />
              <Text style={styles.text}>{this.state.user.nama}</Text>
            </View>

            {/* {this.state.isEditAdress ? (
          <View style={styles.body3}>
            <TextInput
              placeholder="Edit Alamat"
              value={this.state.alamat}
              onChangeText={(alamat) => this.setState({alamat})}
            />
            <View style={styles.body4}>
              <TouchableOpacity style={styles.icon}>
                <Icon name={'check'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => this.setState({isEditAdress: false})}>
                <Icon name={'close'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.body2}>
            <Text>Alamat : Samata</Text>
            <TouchableOpacity
              onPress={() => this.setState({isEditAdress: true})}>
              <Icon name={'edit'} />
            </TouchableOpacity>
          </View>
        )} */}

            {/* {this.state.isEditJK ? (
          <View style={styles.body3}>
            <TextInput
              placeholder="Edit jenis kelamin"
              value={this.state.edit_jk}
              onChangeText={(edit_jk) => this.setState({edit_jk})}
            />
            <View style={styles.body4}>
              <TouchableOpacity style={styles.icon}>
                <Icon name={'check'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => this.setState({isEditJK: false})}>
                <Icon name={'close'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.body2}>
            <Text>Jenis Kelamin :laki-laki</Text>
            <TouchableOpacity onPress={() => this.setState({isEditJK: true})}>
              <Icon name={'edit'} />
            </TouchableOpacity>
          </View>
        )} */}

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
            <View style={[styles.body2, {flexDirection: 'column'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>Status: </Text>
                <View
                  style={{
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                    backgroundColor:
                      this.state.user?.status === 'approved'
                        ? '#007e33'
                        : this.state.user?.status === 'rejected'
                        ? '#cc0000'
                        : '#ff8800',
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    {this.state.user?.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              {this.state.user?.status === 'rejected' ? (
                <View>
                  <View style={styles.child2}>
                    <Text style={styles.txfile}>Upload File Ulang : </Text>
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
                    <View
                      style={{
                        marginHorizontal: 30,
                        marginTop: 10,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{color: 'cornflowerblue', fontWeight: 'bold'}}>
                        {this.state.file?.name}
                      </Text>
                      <TouchableOpacity
                        style={styles.btn}
                        onPress={this._saveFile}>
                        {this.state.loadingFile ? (
                          <ActivityIndicator color={'#000'} />
                        ) : (
                          <Text>Simpan</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>

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
            {/* {this.state.isEditEmail ? (
          <View style={styles.body3}>
            <TextInput
              placeholder="Edit Email"
              value={this.state.edit_email}
              onChangeText={(edit_email) => this.setState({edit_email})}
            />
            <View style={styles.body4}>
              <TouchableOpacity style={styles.icon}>
                <Icon name={'check'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => this.setState({isEditEmail: false})}>
                <Icon name={'close'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.body2}>
            <Text>Email : Nana@gmail.com</Text>
            <TouchableOpacity
              onPress={() => this.setState({isEditEmail: true})}>
              <Icon name={'edit'} />
            </TouchableOpacity>
          </View>
        )} */}

            {/* {this.state.isEditHarga ? (
          <View style={styles.body3}>
            <TextInput
              placeholder="Edit Harga"
              value={this.state.edit_harga}
              onChangeText={(edit_harga) => this.setState({edit_harga})}
            />
            <View style={styles.body4}>
              <TouchableOpacity style={styles.icon}>
                <Icon name={'check'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.icon}
                onPress={() => this.setState({isEditHarga: false})}>
                <Icon name={'close'} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.body2}>
            <Text>Harga : RP.20.000</Text>
            <TouchableOpacity
              onPress={() => this.setState({isEditHarga: true})}>
              <Icon name={'edit'} />
            </TouchableOpacity>
          </View>
        )} */}
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
export default TampilanProfil;
