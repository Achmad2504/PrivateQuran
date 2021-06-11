import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('token', jsonValue);
  } catch (e) {
    // saving error
  }
};

const getToken = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('token');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // reading value
  }
};
const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (e) {
    // error reading value
  }
};
export {storeToken, getToken, removeToken};
