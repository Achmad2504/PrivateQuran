import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import {List, ListItem, Left, Body, Thumbnail, Right} from 'native-base';
import Geocoder from 'react-native-geocoding';
import {getToken} from '../constants';
import database from '@react-native-firebase/database';

// Initialize the module (needs to be done only once)
Geocoder.init('AIzaSyDh0_cYDi7QnGOaXyax9jN2gdeD-X5jDR0'); // use a valid API key

export default class CariGuru extends Component {
  data = this.props.route.params?.data;
  profil = this.props.route.params?.profil;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      lat: this.profil.lat,
      lng: this.profil.lng,
      coords: [-5.2029662, 119.4991688],
      closest: [],
      selected: null,
    };
    this.mapRef = React.createRef();
  }

  componentDidMount = () => {
    // this._getMyLocation();
    this.computeDistance(this.state.lat, this.state.lng);
  };

  _getMyLocation = () => {
    Geolocation.getCurrentPosition((info) => {
      this.setState(
        {lat: info.coords.latitude, lng: info.coords.longitude},
        () => {
          this.computeDistance(this.state.lat, this.state.lng);
        },
      );
    });
  };

  computeDistance = (lat, lng) => {
    const latInRad = this.toRad(lat);
    const longInRad = this.toRad(lng);
    const arr = [];

    this.data
      .filter((i) => i?.status === 'approved')
      .map((item, index) => {
        const prevLatInRad = this.toRad(item.latitude);
        const prevLongInRad = this.toRad(item.longitude);
        // In kilometers
        const res =
          6377.830272 *
          Math.acos(
            Math.sin(prevLatInRad) * Math.sin(latInRad) +
              Math.cos(prevLatInRad) *
                Math.cos(latInRad) *
                Math.cos(longInRad - prevLongInRad),
          );
        const dd = item;
        dd['jarak'] = res;
        dd['jarak_text'] = `${res} km`;
        arr.push(dd);
      });
    arr.sort(function (a, b) {
      return a.jarak - b.jarak;
    });
    const newArr = arr.filter((l, i) => i < 3);
    this.setState({closest: newArr});
  };

  toRad = (angle) => {
    return (angle * Math.PI) / 180;
  };

  _viewPesan = () => {
    const detail = this.state.selected;
    return (
      <View>
        <View>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail
                  source={{
                    uri:
                      'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
                  }}
                />
              </Left>
              <Body>
                <Text>Nama : {detail.nama}</Text>
                <Text>Alamat : {detail.alamat}</Text>
                <Text>Jasa/Hari : Rp. {detail?.Jasa}</Text>
                <Text>No_Hp: {detail.phone}</Text>
                <Text>Jarak: {detail.jarak.toFixed(2)} km</Text>
                <Text>Jadwal: {detail.jadwal}</Text>
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
  _requestPemesanan = async () => {
    const data = this.state.selected;
    const token = await getToken();
    const id = Date.now();
    this.setState({loading: true});

    database()
      .ref(`tb_request_pemesanan/${data.id}/${token.token}`)
      .set({
        nama: this.profil.nama,
        alamat: this.profil.alamat,
        phone: this.profil.phone,
        jarak: data.jarak,
        jadwal: this.profil.jadwal,
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

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <MapView
          onMapReady={() => {
            this._map.fitToSuppliedMarkers(['mk', 'mk1', 'mk2', 'mk3'], {
              edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
            });
          }}
          followsUserLocation={true}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE}
          ref={(map) => (this._map = map)}
          style={{flex: 1}}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: this.state?.lat,
            longitude: this.state?.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            title={'Lokasi Saya'}
            identifier={'mk'}
            coordinate={{
              latitude: this.state?.lat,
              longitude: this.state?.lng,
            }}>
            <Image
              style={{width: 36, height: 40}}
              source={{
                uri:
                  'https://nishati-us.com/wp-content/uploads/2014/09/red-location-icon-map-png-4.png',
              }}
            />
          </Marker>

          {this.state.closest.map((item, index) => {
            return (
              <Marker
                title={`Lokasi ${item.nama}`}
                identifier={`mk${index + 1}`}
                key={index}
                onPress={() => this.setState({selected: item})}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}>
                <Image
                  style={{width: 40, height: 40, borderRadius: 40 / 2}}
                  source={{
                    uri: item.image
                      ? item.image
                      : 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
                  }}
                />
              </Marker>
            );
          })}
        </MapView>
        {this.state.selected ? this._viewPesan() : null}
        {/* <TouchableOpacity
          onPress={() => {
            Geocoder.from({
              latitude: this.state.lat,
              longitude: this.state.lng,
            }).then((json) => {
              console.log('jj', json.results[0].formatted_address);
            });
          }}
          style={{backgroundColor: 'red', padding: 20}}>
          <Text>TESSS</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
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
    color: '#fff',
    fontWeight: 'bold',
  },
});
