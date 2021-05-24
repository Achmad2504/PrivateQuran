import React, {Component} from 'react';
import {FlatList, View, Image, Text} from 'react-native';
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
  //mengambil data dari database pada tabel data murid
  _getdatamurid = async () => {
    const token = await getToken();
    database()
      .ref(`/tb_data_murid/${token.token}`)
      .on('value', (snap) => {
        if (snap.val()) {
          let arr = Object.values(snap.val());
          let keys = Object.keys(snap.val());
          for (const i in arr) {
            for (const j in keys) {
              if (i === j) arr[i]['id'] = keys[j];
            }
          }
          this.setState({dataMurid: arr});
        }
      });
  };

  componentDidMount = () => {
    this._getdatamurid();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.dataMurid.length === 0 ? (
          <View
            style={{
              backgroundColor: '#fff',
              flex: 1,
              alignItems: 'center',
              paddingTop: 50,
            }}>
            <Image
              source={require('../aseets/empty.png')}
              style={{
                width: 200,
                height: 200,
                resizeMode: 'stretch',
                marginBottom: 20,
              }}
            />
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Data Monitoring Masih kosong.
            </Text>
          </View>
        ) : (
          <FlatList
            data={this.state.dataMurid}
            renderItem={({item}) => (
              <ListMurid nana={item} onPress={() => this._toMonitoring(item)} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </View>
    );
  }
}

export default MonitoringGuru;
