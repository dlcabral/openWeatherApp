/* eslint-disable prettier/prettier */
import React, {FC, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

export interface Props{
  modalSearch: boolean,
  closeModal: ()=> {},
  goToCityDetails: (any)=> {},
}

const SearchModal: FC<Props> = (props) => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);

  const searchByCity = () => {
    if (search.length === 0) {
      Alert.alert(
        'Please, provide a city.',
        'Search is empty',
        [{text: 'Ok', onPress: () => {}}],
        {cancelable: false},
      );
    } else {
      const citiesArray = [];
      let index = 0;

      fetch(
        'http://api.openweathermap.org/data/2.5/weather?q=' +
        search +
        '&appid=e171929c9baccfd16eae065813feebff',
      )
      .then((response) => response.json()).then((json) => {
        citiesArray.push({
          id: index++,
          item: json,
        });

        if (citiesArray[0].item.cod == 404){
          Alert.alert(
            search + ' was not found.',
            'Please, make sure this city exists.',
            [{text: 'Ok', onPress: () => {}}],
            {cancelable: false},
          );
        }
        else {
          setCities(citiesArray);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  useEffect(() => {
    return () => {
      console.log('cleaned up');
    };
  }, []);

  return (
    <View style={{flexDirection: 'row'}}>
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalSearch}
          onRequestClose={() => props.closeModal()}>
          <View style={styles.viewInformation}>
            <View style={styles.viewSearch}>
              <Icon name="search" size={45} color="black" />
              <TextInput
                style={styles.inputSearch}
                onChangeText={(text) => setSearch(text)}
                value={search}
                placeholderTextColor={'gray'}
                placeholder="Search City"
                onSubmitEditing={() => {
                  searchByCity();
                }}
              />
              <TouchableOpacity
                onPress={() => props.closeModal()}
                style={styles.viewClose}>
                <Text style={styles.textClose}>x</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.viewCitiesSearch}>
              <FlatList
                nestedScrollEnabled
                data={cities}
                renderItem={({item}) => {
                  console.log(item);
                  return (
                    <View style={styles.viewCity}>
                      <TouchableOpacity
                        onPress={() => props.goToCityDetails(item)}
                        style={styles.buttonCity}>
                        <Icon
                          name="location"
                          size={30}
                          color="black"
                          style={styles.viewIcon}
                        />
                        <Text style={styles.textCity}>{item.item.name}</Text>
                        <Text style={styles.textTemp}>
                          {(item.item.main.temp + -1 * 273.15).toFixed(0)} °C
                        </Text>
                        <Image
                          source={{
                            uri: `http://openweathermap.org/img/w/${item.item.weather[0].icon}.png`,
                          }}
                          style={styles.logo}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                extraData={cities}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewInformation: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '5%',
    backgroundColor: '#ffffff',
  },
  viewSearch: {
    flexDirection: 'row',
    width: '100%',
    height: '7%',
  },
  inputSearch: {
    width: '75%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#8CD4C8',
    color: '#FFFFFF',
    borderColor: '#8CD4C8',
  },
  viewClose: {
    width: '13%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textClose: {
    fontSize: 35,
    color: 'black',
    fontFamily: 'Arial',
  },
  textCity: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Arial',
    marginRight: '30%',
  },
  textTemp: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Arial',
  },
  viewCitiesSearch: {
    width: '100%',
    height: '90%',
    marginTop: 10,
  },
  viewCity: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'gray',
  },
  buttonCity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    marginTop: 10,
  },
  logo: {
    width: '10%',
    height: '40%',
    marginRight: '5%',
  },
  viewIcon: {
    marginLeft: '5%',
  },
});

export default SearchModal;
