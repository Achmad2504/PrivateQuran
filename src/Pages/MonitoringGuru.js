import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {dataMurid} from '../dummy';
import ListMurid from './List/ListMurid';
import database from '@react-native-firebase/database';
import {getToken} from '../constants';
export class MonitoringGuru extends Component {
  _toMonitoring = (item) => {
    this.props.navigation.navigate('DaftarMonitoring', {data: item});
  };
  state = {
    dataMurid: [],
  };

  _getdatamurid = async () => {
    const token = await getToken();
    database()
      .ref(`/tb_data_murid/${token.token}`)
      .on('value', (snap) => {
        let arr = Object.values(snap.val());
        let keys = Object.keys(snap.val());
        for (const i in arr) {
          for (const j in keys) {
            if (i === j) arr[i]['id'] = keys[j];
          }
        }

        this.setState({dataMurid: arr});
      });
  };

  componentDidMount = () => {
    this._getdatamurid();
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.state.dataMurid}
          renderItem={({item}) => (
            <ListMurid nana={item} onPress={() => this._toMonitoring(item)} />
          )}
          keyExtractor={(item) => item.username}
        />
      </View>
    );
  }
}

export default MonitoringGuru;
