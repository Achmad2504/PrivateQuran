import React, {Component} from 'react';
import {FlatList, View, Text, StyleSheet} from 'react-native';
import {get} from 'react-native/Libraries/Utilities/PixelRatio';
import {getToken} from '../constants';
import {hasilmonitoring} from '../dummy';
import database from '@react-native-firebase/database';
import sortArray from 'sort-array';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Entypo';

export class HasilMonitoring extends Component {
  state = {
    activeSections: [],
    hasilmonitoring: [],
  };

  _getdatamonitoring = async () => {
    const token = await getToken();

    database()
      .ref(`/tb_hasil_monitoring/${token.token}`)
      .on('value', (snap) => {
        if (!snap.val()) {
          this.setState({hasilmonitoring: []});
        } else {
          let arr = Object.values(snap.val());
          let keys = Object.keys(snap.val());
          for (const i in arr) {
            for (const j in keys) {
              if (i === j) arr[i]['id'] = keys[j];
            }
          }
          this.setState({hasilmonitoring: arr});
        }
      });
  };

  componentDidMount = () => {
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
    const data = sortArray(this.state.hasilmonitoring, {
      by: 'createAt',
      order: 'asc',
    });

    return (
      <View style={styles.body}>
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

export default HasilMonitoring;
