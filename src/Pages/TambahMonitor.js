import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {black, white} from '../color';
import {getToken} from '../constants';
import database from '@react-native-firebase/database';

export class TambahMonitor extends Component {
  // _tosave = () => {
  //   this.props.navigation.navigate('DaftarMonitoring');
  // };

  state = {
    title: '',
    isititle: '',
  };

  _tambahMonitor = async () => {
    const token = await getToken();
    const userid = this.props.route.params.idmurid;
    const id = Date.now();
    database()
      .ref(`tb_monitoring/${token.token}/${userid}/${id}`)

      .set({
        title: this.state.title,
        isititle: this.state.isititle,
        createAt: id,
      })
      .then(() => {
        this.props.navigation.navigate('DaftarMonitoringGuru');
        this.setState({loading: false});
      })
      .catch(() => {
        this.setState({loading: false});
      });
    database()
      .ref(`tb_hasil_monitoring/${userid}/${id}`)
      .set({
        title: this.state.title,
        isititle: this.state.isititle,
      })
      .then(() => {
        this.props.navigation.navigate('DaftarMonitoringGuru');
        this.setState({loading: false});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  };

  render() {
    return (
      <SafeAreaView>
        <View style={styles.child1}>
          <TextInput
            value={this.state.title}
            onChangeText={(value) => this.setState({title: value})}
            placeholder={'Title'}
            style={styles.text1}
          />
          <TextInput
            value={this.state.isititle}
            onChangeText={(value) => this.setState({isititle: value})}
            multiline={true}
            placeholder={'Isi Monitoring'}
            style={styles.text1}
          />
        </View>
        <View>
          <TouchableOpacity style={styles.btn} onPress={this._tambahMonitor}>
            <Text style={styles.text2}>Save</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  text1: {
    backgroundColor: white,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    color: black,
  },
  child1: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#2ECC71',
    paddingVertical: 10,
    marginHorizontal: 120,
    marginVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  text2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TambahMonitor;
