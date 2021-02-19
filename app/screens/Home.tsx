/* eslint-disable prettier/prettier */
import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import ModalCities from '../components/modals/CitiesModal';

const { width } = Dimensions.get('window');
let cities = [];

export interface Props{
  navigation: any,
  closeModal: ()=> {},
  goToCityDetails: ()=> {},
}

const Home: FC<Props> = (props)=>{
  const [ marker, setMarker ] = useState([]);
  const [ modalCities, setModalCities ] = useState({
    visible: false,
  });

  const onMapPress = (event)=>{
    setMarker([
      {
        coordinate: event.nativeEvent.coordinate,
        key: 0,
     },
    ]);
  };

  const findNearestCities = ()=>{
    if (marker.length === 0){
      Alert.alert(
        'Please, provide a location on the map.',
        'Click on the map to attach a pin.',
        [
          { text: 'Ok', onPress: () => {}},
        ],
        { cancelable: false }
      );
    }
    else {
      fetch('http://api.openweathermap.org/data/2.5/find?lat=' +
        marker[0].coordinate.latitude + '&lon=' +
        marker[0].coordinate.longitude + '&cnt=15&APPID=e171929c9baccfd16eae065813feebff')
      .then((response) => response.json())
      .then((json) => {
        cities.splice(0);

        json.list.forEach((item: any, index: number)=>{
          cities.push({
            id: index,
            item: item,
          });
        });

        setModalCities({
          visible: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    }
  };

  const closeModal = ()=>{
    setModalCities({
      visible: false,
    });
  };

  const goToCityDetails = (city: any)=>{
    setModalCities({
      visible: false,
    });

    props.navigation.navigate('CityDetailsScreen', {city: city});
  };

  return (
    <>
      <View style={styles.container}>
        <ModalCities modalCitiesVisible={modalCities.visible}
          closeModal={()=> closeModal()}
          goToCityDetails={goToCityDetails}
          cities={cities}
          {...props} />
        <TouchableOpacity onPress={()=> findNearestCities()} style={styles.buttonStart}>
          <Text style={styles.textButton}>Search</Text>
        </TouchableOpacity>
        <MapView
          initialRegion={{
            latitude: 49.895297,
            longitude: -97.138384,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={(event) => onMapPress(event)}
          style={styles.viewMap}>
            {marker.map(markerObj => (
              <Marker
                key={markerObj.key}
                coordinate={markerObj.coordinate}
              />
            ))}
        </MapView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStart: {
    width: '50%',
    height: '5%',
    position: 'absolute',
    zIndex: 1100,
    top: '5%',
    left: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 50,
  },
  textButton: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  viewMap: {
    width: '100%',
    height: '100%',
  },
});

export default Home;
