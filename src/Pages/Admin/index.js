import React, {Component} from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ListIndex from '../../Pages/List/ListIndex';
import database from '@react-native-firebase/database';
import {white, black} from '../../color';
import Icon from 'react-native-vector-icons/AntDesign';
import {removeToken} from '../../constants';

export class index extends Component {
  state = {
    dataAdmin: [],
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

  // get data admin
  _getdataadmin = () => {
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

        this.setState({dataAdmin: arr});
      });
  };
  componentDidMount = () => {
    this._getdataadmin();
  };

  render() {
    return (
      <View>
        <View style={styles.header}>
          <Text style={styles.txheader}> MENU </Text>
          <TouchableOpacity style={styles.icon} onPress={this._logout}>
            <Icon name={'logout'} size={20} color={black} />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <FlatList
            data={this.state.dataAdmin.filter(
              (i) => i?.level !== 'admin' && i?.status === 'pending',
            )}
            renderItem={({item}) => (
              <ListIndex
                nana={item}
                navigation={this.props.navigation}
                profil={this.state.profil}
              />
            )}
            keyExtractor={(item) => item.username}></FlatList>
        </View>
      </View>
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
  icon: {
    position: 'absolute',
    top: 25,
    right: 16,
  },
});

export default index;
