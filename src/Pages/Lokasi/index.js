import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

const apiMaps = 'AIzaSyDh0_cYDi7QnGOaXyax9jN2gdeD-X5jDR0';
Geocoder.init(apiMaps);

export class Map extends Component {
  location = this.props.route.params.location;
  constructor(props) {
    super(props);
    this.state = {
      lat: this.location ? this.location.lat : -5.2056909,
      lng: this.location ? this.location.lng : 119.4951961,
      address: this.location ? this.location.address : '',
    };
  }

  //berfungsi untuk mendapatkan nilai lat dan lng dari alamt
  //berfungsu untuk mengubah deskiripsi lokasi menjdi kordinatS
  _getLatLng = (address) => {
    Geocoder.from(address)
      .then((json) => {
        const {lat, lng} = json.results[0].geometry.location;
        this.setState({lat, lng, address});
      })
      .catch((error) => console.warn(error));
  };
  _getAddress = (lat, lng) => {
    Geocoder.from([lat, lng])
      .then((json) => {
        const address = json.results[0].formatted_address;
        this.setState({address});
      })
      .catch((error) => console.warn(error));
  };

  componentDidMount = () => {
    if (!this.location) {
      this._getMyLocation();
    }
  };

  _getMyLocation = () => {
    Geolocation.getCurrentPosition((info) => {
      this.setState(
        {lat: info.coords.latitude, lng: info.coords.longitude},
        () => {
          this._getAddress(this.state.lat, this.state.lng);
        },
      );
    });
  };

  _confirm = () => {
    const d = {
      address: this.state.address,
      lat: this.state.lat,
      lng: this.state.lng,
    };
    // console.log(this.props.route.params);
    this.props.route.params.setLocation(d);
    this.props.navigation.goBack(null);
    if (this.props.route.params?.profile) {
      this.props.route.params?.saveLocation(d);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          styles={{
            container: {
              flex: 0,
              margin: 16,
            },
          }}
          placeholder="Search"
          onPress={(data) => {
            this._getLatLng(data.description);
          }}
          query={{
            key: apiMaps,
            language: 'id',
            components: 'country:id',
          }}
        />
        <MapView
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: this.state.lat,
            longitude: this.state.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{latitude: this.state.lat, longitude: this.state.lng}}
            title={'My Location'}
          />
        </MapView>
        <View style={{backgroundColor: '#dadada', padding: 20}}>
          <Text>{this.state.address}</Text>
          <TouchableOpacity
            onPress={this._confirm}
            style={{
              backgroundColor: 'green',
              padding: 16,
              alignItems: 'center',
              marginTop: 16,
            }}>
            <Text style={{color: '#fff'}}>Konfirmasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;
