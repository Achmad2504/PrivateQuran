import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';
import {dataGuru} from '../dummy';
import ListGuru from './List/ListGuru';
import database from '@react-native-firebase/database';
import {getToken} from '../constants';

export class DataGuru extends Component {
  state = {
    dataGuru: [],
    profil: null,
  };

  _getProfilMurid = async () => {
    const token = await getToken();
    database()
      .ref(`tb_register_murid/${token.token}`)
      .on('value', (snap) => {
        this.setState({profil: snap.val()});
      });
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

        this.setState({dataGuru: arr});
      });
  };
  componentDidMount = () => {
    this._getdataguru();
    this._getProfilMurid();
  };
  render() {
    return (
      <View>
        <FlatList
          data={this.state.dataGuru.filter((i) => i?.status === 'approved')}
          renderItem={({item}) => (
            <ListGuru
              nana={item}
              navigation={this.props.navigation}
              profil={this.state.profil}
            />
          )}
          keyExtractor={(item) => item.username}
        />
      </View>
    );
  }
}

export default DataGuru;
