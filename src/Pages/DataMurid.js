import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {dataMurid} from '../dummy';
import ListMurid from './List/ListMurid';
import database from '@react-native-firebase/database';
import {getToken} from '../constants';

export class DataMurid extends Component {
  state = {
    dataMurid: [],
  };

  _getdatamurid = async () => {
    const token = await getToken();

    database()
      .ref(`/tb_data_murid/${token.token}`)
      .on('child_added', (snap) => {
        this.setState((prev) => {
          return {
            dataMurid: [...prev.dataMurid, snap.val()],
          };
        });
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
          renderItem={({item}) => <ListMurid nana={item} />}
          keyExtractor={(item) => item.username}
        />
      </View>
    );
  }
}

export default DataMurid;
