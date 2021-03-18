import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export class Choose extends Component {
  render() {
    return (
      <View {...this.props}>
        {this.props.location && <Text>{this.props.location?.address}</Text>}
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Lokasi', {
              saveLocation: (val) => this.props?.saveLocation(val),
              profile: this.props?.profile,
              setLocation: (val) => this.props.setLocation(val),
              location: this.props.location,
            })
          }
          style={{
            padding: 12,
            borderWidth: 2,
            backgroundColor: '#D5F5E3',
            borderColor: 'rgba(0,0,0,0.2)',
            marginVertical: 10,
            borderRadius: 10,
            borderStyle: 'dashed',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Icon name="add" size={26} style={{marginRight: 16}} />
          <Text>{this.props.location ? 'Ganti Lokasi' : 'Pilih Lokasi'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Choose;
