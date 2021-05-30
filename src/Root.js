// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Geolocation from '@react-native-community/geolocation';

const Stack = createStackNavigator();

import Splash from './Pages/Splash';
import Splash1 from './Pages/Splash1';
import LoginMurid from './Pages/LoginMurid';
import dbMurid from './Pages/dbMurid';
import dbGuru from './Pages/dbGuru';
import RegisterMurid from './Pages/RegisterMurid';
import Register from './Pages/Register';
import Login from './Pages/Login';
import DataMurid from './Pages/DataMurid';
import MonitoringGuru from './Pages/MonitoringGuru';
import DaftarMonitoringGuru from './Pages/DaftarMonitoringGuru';
import TambahMonitor from './Pages/TambahMonitor';
import DataGuru from './Pages/DataGuru';
import HasilMonitoring from './Pages/HasilMonitoring';
import NotifGuru from './Pages/NotifGuru';
import TampilanProfil from './TampilanProfil';
import TampilanProfilMurid from './TampilanProfilMurid';
import NotifMurid from './Pages/NotifMurid';
import CariGuru from './Pages/CariGuru';
import Lokasi from './Pages/Lokasi';
import Admin from './Pages/Admin';
import PDFView from './Pages/PDFView';
import {hijau_terang} from './color';
import Icon from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

function TabGuru() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else {
            iconName = 'user';
          }

          return (
            <Icon
              name={iconName}
              size={20}
              color={focused ? 'black' : 'white'}
            />
          );
        },
      })}
      tabBarOptions={{
        labelStyle: {fontSize: 12},
        activeTintColor: 'black',
        inactiveTintColor: 'white',
        style: {backgroundColor: hijau_terang},
      }}>
      <Tab.Screen name="Home" component={dbGuru} />
      <Tab.Screen name="Profil" component={TampilanProfil} />
    </Tab.Navigator>
  );
}

function TabMurid() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else {
            iconName = 'user';
          }

          return (
            <Icon
              name={iconName}
              size={20}
              color={focused ? 'black' : 'white'}
            />
          );
        },
      })}
      tabBarOptions={{
        labelStyle: {fontSize: 12},
        activeTintColor: 'black',
        inactiveTintColor: 'white',
        style: {backgroundColor: hijau_terang},
      }}>
      <Tab.Screen name="Home" component={dbMurid} />
      <Tab.Screen name="Profil" component={TampilanProfilMurid} />
    </Tab.Navigator>
  );
}

function App() {
  React.useEffect(() => {
    _getMyLocation();
  }, []);

  const _getMyLocation = () => {
    Geolocation.getCurrentPosition((info) => {});
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Splash1"
          component={Splash1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginMurid"
          component={LoginMurid}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterMurid"
          component={RegisterMurid}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="dbMurid"
          component={TabMurid}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="dbGuru"
          component={TabGuru}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DataMurid"
          component={DataMurid}
          options={{title: 'Data Murid', headerShown: true}}
        />
        <Stack.Screen
          name="MonitoringGuru"
          component={MonitoringGuru}
          options={{title: 'Laporan Penilaian Guru', headerShown: true}}
        />
        <Stack.Screen
          name="DaftarMonitoringGuru"
          component={DaftarMonitoringGuru}
          options={({route}) => ({
            title: `Laporan Hasil Penilaian ${route.params.data.nama}`,
          })}
        />
        <Stack.Screen
          name="TambahMonitor"
          component={TambahMonitor}
          options={{title: 'Tambah Penilaian', headerShown: true}}
        />
        <Stack.Screen
          name="DataGuru"
          component={DataGuru}
          options={{title: 'Data Guru', headerShown: true}}
        />
        <Stack.Screen
          name="HasilMonitoring"
          component={HasilMonitoring}
          options={{title: 'Hasil Laporan Penilaian', headerShown: true}}
        />
        <Stack.Screen
          name="NotifGuru"
          component={NotifGuru}
          options={{title: 'Notfikasi', headerShown: true}}
        />
        <Stack.Screen
          name="NotifMurid"
          component={NotifMurid}
          options={{title: 'Notifikasi', headerShown: true}}
        />
        <Stack.Screen
          name="CariGuru"
          component={CariGuru}
          options={{title: 'Pencarian Guru', headerShown: true}}
        />
        <Stack.Screen
          name="Lokasi"
          component={Lokasi}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="PDFView"
          component={PDFView}
          options={({route}) => ({title: `File SK ${route.params.item.nama}`})}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
