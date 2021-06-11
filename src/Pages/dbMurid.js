import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  BackHandler,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {black, white} from '../color';
import Icon from 'react-native-vector-icons/AntDesign';
import {getToken, removeToken} from '../constants';
import database from '@react-native-firebase/database';

export class dbMurid extends Component {
  state = {
    data: [],
    profil: null,
  };

  _getdataguru = () => {
    database()
      .ref('/tb_register_guru')
      .on('value', (snap) => {
        let arr = Object.values(snap.val());
        let keys = Object.keys(snap.val());
        for (const i in arr) {
          for (const j in keys) {
            if (i === j) arr[i]['id'] = keys[j];
          }
        }

        this.setState({data: arr});
      });
  };

  // _getData = () => {
  //   database()
  //     .ref('/tb_register_guru')
  //     .on('child_added', (snap) => {
  //       this.setState((prev) => {
  //         return {
  //           data: [...prev.data, snap.val()],
  //         };
  //       });
  //     });
  // };

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

  async componentDidMount() {
    const a = await getToken();
    this.setState({profil: a});
    // this._getData();
    this._getdataguru();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  _toCariGuru = () => {
    this.props.navigation.navigate('CariGuru', {
      data: this.state.data,
      profil: this.state.profil,
    });
  };
  _toDataGuru = () => {
    this.props.navigation.navigate('DataGuru');
  };
  _toHasilMonitor = () => {
    this.props.navigation.navigate('HasilMonitoring');
  };
  _toNotifMurid = () => {
    this.props.navigation.navigate('NotifMurid');
  };

  _logout = () => {
    removeToken().then(() => {
      Alert.alert('', 'Logout', [
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
        <View style={styles.child1}>
          <Pressable onPress={this._toCariGuru}>
            <Image
              source={require('../aseets/cariguru.png')}
              style={styles.img}></Image>
          </Pressable>
          <Pressable onPress={this._toDataGuru}>
            <Image
              source={require('../aseets/daftarguru.png')}
              style={styles.img}></Image>
          </Pressable>
        </View>
        <View style={styles.child2}>
          <Pressable onPress={this._toHasilMonitor}>
            <Image
              source={require('../aseets/hasillaporan.png')}
              style={styles.imglaporan}></Image>
          </Pressable>
          <Pressable onPress={this._toNotifMurid}>
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
  child1: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  child2: {
    flexDirection: 'row',
    justifyContent: 'center',
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

export default dbMurid;
