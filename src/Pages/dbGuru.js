import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import {white, black} from '../color';
import Icon from 'react-native-vector-icons/AntDesign';
import {removeToken} from '../constants';

export class dbGuru extends Component {
  backAction = () => {
    if (this.props.navigation.isFocused()) {
      Alert.alert('', 'Apakah Anda Yakin Ingin Keluar?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    }
    // if (this.props.route.name !== 'dbMurid') {
    //   return false;
    // } else {
    //
    // }
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }
  _DataMurid = () => {
    this.props.navigation.navigate('DataMurid');
  };
  _MonitoringGuru = () => {
    this.props.navigation.navigate('MonitoringGuru');
  };
  _toNotifGuru = () => {
    this.props.navigation.navigate('NotifGuru');
  };
  _logout = () => {
    removeToken().then(() => {
      Alert.alert('', 'Logout?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => this.props.navigation.navigate('Splash1')},
      ]);
    });
  };
  render() {
    return (
      <SafeAreaView style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.txheader}> MENU </Text>
          <TouchableOpacity style={styles.icon} onPress={this._logout}>
            <Icon name={'logout'} size={20} color={black} />
          </TouchableOpacity>
        </View>
        <View style={styles.child2}>
          <Pressable onPress={this._DataMurid}>
            <Image
              source={require('../aseets/daftarmurid.png')}
              style={styles.img}></Image>
          </Pressable>
          <Pressable onPress={this._MonitoringGuru}>
            <Image
              source={require('../aseets/laporan.png')}
              style={styles.imglaporan}></Image>
          </Pressable>
          <Pressable onPress={this._toNotifGuru}>
            <Image
              source={require('../aseets/notifikasi.png')}
              style={styles.img}></Image>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: white,
  },
  header: {
    backgroundColor: '#15ED3C',
    height: 70,
    alignItems: 'center',
  },
  txheader: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
  },
  child2: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  img: {
    height: 150,
    width: 150,
  },
  imglaporan: {
    height: 100,
    width: 100,
    marginTop: 30,
    marginRight: 30,
    marginLeft: 30,
  },
  icon: {
    position: 'absolute',
    top: 25,
    right: 16,
  },
});

export default dbGuru;
