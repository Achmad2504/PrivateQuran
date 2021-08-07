import React, {Component} from 'react';
import {Text, View, FlatList, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {white} from '../color';
import {getToken} from '../constants';
import {datamonitoring} from '../dummy';
import ListMonitoringGuru from './List/ListMonitoring';
import database from '@react-native-firebase/database';
import sortArray from 'sort-array';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Entypo';

export class DaftarMonitoringGuru extends Component {
  _toTambah = () => {
    this.props.navigation.navigate('TambahMonitor', {
      idmurid: this.props.route.params.data.id,
    });
  };

  state = {
    datamonitoring: [],
    activeSections: [],
  };
  _getdatamonitoring = async () => {
    const token = await getToken();
    const userid = this.props.route.params.data.id;

    database()
      .ref(`/tb_monitoring/${token.token}/${userid}`)
      .on('value', (snap) => {
        if (!snap.val()) {
          this.setState({datamonitoring: []});
        } else {
          let arr = Object.values(snap.val());
          let keys = Object.keys(snap.val());
          for (const i in arr) {
            for (const j in keys) {
              if (i === j) arr[i]['id'] = keys[j];
            }
          }
          this.setState({datamonitoring: arr});
        }
      });
  };

  componentDidMount = async () => {
    this._getdatamonitoring();
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
  _renderContent = (section, _, isActive) => {
    return (
      <View style={[styles.content, isActive && styles.borderStyle]}>
        <Text>{section.isititle}</Text>
      </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({activeSections});
  };
  render() {
    const data = sortArray(this.state.datamonitoring, {
      by: 'createAt',
      order: 'asc',
    });

    return (
      <View>
        <TouchableOpacity style={styles.btn} onPress={this._toTambah}>
          <Text style={{color: white}}>Tambah Penilaian</Text>
        </TouchableOpacity>
        <Accordion
          sections={data}
          activeSections={this.state.activeSections}
          //renderSectionTitle={this._renderSectionTitle}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#2ECC71',
    paddingVertical: 12,
    marginHorizontal: 72,
    marginVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  header: {
    padding: 12,
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#D0D3D4',
    borderColor: '#000',
  },
  borderStyle: {
    borderBottomWidth: 1,
  },
  text1: {
    fontWeight: 'bold',
  },
});

export default DaftarMonitoringGuru;
