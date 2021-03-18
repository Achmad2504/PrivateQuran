import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
} from 'react-native';
import {hijau_terang, white} from '../color';

export class Splash1 extends Component {
  _guru = () => {
    this.props.navigation.navigate('Login');
  };

  _murid = () => {
    this.props.navigation.navigate('LoginMurid');
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <View style={styles.child1}>
            <Image
              source={require('../aseets/logo1.png')}
              resizeMode="stretch"
              style={styles.logo}></Image>
          </View>
          <View style={styles.child2}>
            <Pressable onPress={this._guru}>
              <Image
                source={require('../aseets/guru.png')}
                style={styles.imgguru}></Image>
            </Pressable>
            <Pressable onPress={this._murid}>
              <Image
                source={require('../aseets/murid.png')}
                style={styles.imgmurid}></Image>
            </Pressable>
          </View>
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
  logo: {
    height: 150,
    width: 150,
    marginBottom: 50,
    marginTop: 20,
  },
  child1: {
    backgroundColor: '#15ED3C',
    alignItems: 'center',
    padding: 30,
  },
  txheader: {
    fontSize: 24,
    color: white,
    fontWeight: 'bold',
  },
  imgguru: {
    height: 120,
    width: 120,
  },
  imgmurid: {
    height: 120,
    width: 120,
    marginLeft: 60,
  },
  child2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});

export default Splash1;
