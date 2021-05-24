import React, {Component} from 'react';
import {Text, View, FlatList, ToastAndroid} from 'react-native';
import {notifguru} from '../dummy';
import ListNotifGuru from './List/ListNotifGuru';
import sortArray from 'sort-array';
import Accordion from 'react-native-collapsible/Accordion';
import {getToken} from '../constants';
import database from '@react-native-firebase/database';

export class NotifGuru extends Component {
  state = {
    activeSections: [],
    dataPesan: [],
    DataMurid: [],
    loading: false,
    profil: null,
    loading1: false,
  };

  _getProfilGuru = async () => {
    const token = await getToken();
    database()
      .ref(`tb_register_guru/${token.token}`)
      .on('value', (snap) => {
        this.setState({profil: snap.val()});
      });
  };

  _terimapesan = async (data) => {
    const token = await getToken();
    const id = Date.now();
    this.setState({loading: true});

    database()
      .ref(`tb_data_murid/${token.token}/${data.id}`)
      .set({
        nama: data.nama,
        alamat: data.alamat,
        phone: data.phone,
        dateAccept: id,
      })
      .then(() => {
        this.props.navigation.goBack(null);
        ToastAndroid.show('Pemesanan diterima', ToastAndroid.LONG);
        this.setState({loading: false});
        database()
          .ref(`tb_request_pemesanan/${token.token}/${data.id}`)
          .remove();
        database()
          .ref(`tb_notif_murid/${data.id}/${id}`)
          .set({
            message: `Guru ${this.state.profil.nama} menerima pesanan Anda`,
            dateAccept: id,
          });
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };
  _tolakpesan = async (data) => {
    const token = await getToken();
    const id = Date.now();
    this.setState({loading1: true});
    database()
      .ref(`tb_request_pemesanan/${token.token}/${data.id}`)
      .remove()
      .then(() => {
        this.props.navigation.goBack(null);
        ToastAndroid.show('Pemesanan diterima', ToastAndroid.LONG);
        this.setState({loading1: false});
        database()
          .ref(`tb_notif_murid/${data.id}/${id}`)
          .set({
            message: `Guru ${this.state.profil.nama} menolak pesanan Anda`,
            dateAccept: id,
          });
      })
      .catch(() => {
        this.setState({loading1: false});
      });
  };

  _getdatapesan = async () => {
    const token = await getToken();
    database()
      .ref(`/tb_request_pemesanan/${token.token}`)
      .on('value', (snap) => {
        if (!snap.val()) {
          this.setState({dataPesan: []});
        } else {
          let arr = Object.values(snap.val());
          let keys = Object.keys(snap.val());
          for (const i in arr) {
            for (const j in keys) {
              if (i === j) arr[i]['id'] = keys[j];
            }
          }
          this.setState({dataPesan: arr});
        }
      });
  };
  componentDidMount = () => {
    this._getdatapesan();
    this._getProfilGuru();
  };

  _renderHeader = (section, _, isActive) => {
    return (
      <View style={[styles.header, !isActive && styles.borderStyle]}>
        <Text style={styles.text1}>{section.title}</Text>
        <Icon
          name={isActive ? 'chevron-small-down' : 'chevron-small-right'}
          size={20}
        />
      </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({activeSections});
  };

  render() {
    const data = sortArray(this.state.dataPesan, {
      by: 'createAt',
      order: 'asc',
    });
    console.log();
    return (
      <View>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <ListNotifGuru
              nana={item}
              onPress={() => this._terimapesan(item)}
              onPresstolak={() => this._tolakpesan(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }
}

export default NotifGuru;
