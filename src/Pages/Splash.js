import React, {Component} from 'react';
import {
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import {getToken} from '../constants';

export class Splash extends Component {
  componentDidMount = async () => {
    const token = await getToken();
    setTimeout(() => {
      if (token) {
        if (token.level === 'guru') {
          this.props.navigation.navigate('dbGuru');
        } else if (token.level === 'murid') {
          this.props.navigation.navigate('dbMurid');
        } else {
          this.props.navigation.navigate('Admin');
        }
      } else {
        this.props.navigation.navigate('Splash1');
      }
    }, 4000);
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.body}>
          <View>
            <ImageBackground
              style={styles.bgimage}
              source={require('../aseets/splash.png')}>
              <View style={styles.child1}>
                <Image
                  style={styles.image}
                  source={require('../aseets/logo1.png')}></Image>
              </View>
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
  bgimage: {
    height: '100%',
    width: '100%',
  },
  image: {
    height: 180,
    width: 160,
    marginTop: 40,
    padding: 50,
  },
  child1: {
    alignItems: 'center',
    marginTop: 220,
  },
  text1: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5D6D7E',
  },
});

export default Splash;
