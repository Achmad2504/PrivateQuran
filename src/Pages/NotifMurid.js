import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {getToken} from '../constants';
import ListNotifMurid from './List/ListNotifMurid';
import database from '@react-native-firebase/database';
import sortArray from 'sort-array';

export class NotifMurid extends Component {
  state = {
    notifmurid: [],
    activeSections: [],
    loading: false,
  };

  _getnotifmurid = async () => {
    const token = await getToken();

    database()
      .ref(`tb_notif_murid/${token.token}`)
      .on('value', (snap) => {
        if (!snap.val()) {
          this.setState({notifmurid: []});
        } else {
          let arr = Object.values(snap.val());
          let keys = Object.keys(snap.val());
          for (const i in arr) {
            for (const j in keys) {
              if (i === j) arr[i]['id'] = keys[j];
            }
          }
          this.setState({notifmurid: arr});
        }
      });
  };
  componentDidMount = () => {
    this._getnotifmurid();
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
    const data = sortArray(this.state.notifmurid, {
      by: 'createAt',
      order: 'asc',
    });
    return (
      <View>
        <FlatList
          data={data}
          renderItem={({item}) => <ListNotifMurid nana={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }
}

export default NotifMurid;
