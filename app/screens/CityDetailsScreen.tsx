/* eslint-disable prettier/prettier */
import React, {FC, useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import SearchModal from '../components/modals/SearchModal';

interface city{
  lat: number,
  lon: number,
  speed: number,
  humidity: number,
  pressure: number,
  feels_like: string,
  temp_max: number,
  temp_min: number,
}

interface params{
  city: {
    [key: string]: city,
  }
}

interface navigate{
}

export interface Props{
  navigation: {
    [key: string]: navigate,
  },
  route: {
    [key: string]: params,
  },
  closeModal: ()=> {},
  goToCityDetails: ()=> {},
}

const CityDetailsScreen: FC<Props> = (props)=>{
  const [ modalSearch, setModalSearch ] = useState({
    visible: false,
  });
  const [ toggleComponent, setToggleComponent ] = useState(true);
  const [ dayWeather, setDayWeather ] = useState({
    description: '',
    max: 0,
    min: 0,
    icon: '',
    pop: 0,
    wind: 0,
    pressure: 0,
    humidity: 0,
    uvIndex: 0,
  });
  const [ weatherData, setWeatherData ] = useState({
    wind: 0,
    humidity: 0,
    uvIndex: 0,
    pressure: 0,
    visibility: 0,
    dewPoint: 0,
    hourly: [],
    daily: [],
  });

  const closeModal = ()=>{
    setModalSearch({
      visible: false,
    });
  };

  const goToSearch = ()=>{
    setModalSearch({
      visible: true,
    });
  };

  const goToCityDetails = (city)=>{
    setModalSearch({
      visible: false,
    });

    props.navigation.navigate('LoadingScreen', {city: city.item, screen: 'CityDetailsScreen'});
  };

  const changeComponent = (dailyWeather)=>{
    if (toggleComponent){
      setDayWeather({
        description: dailyWeather.weather[0].description,
        max: dailyWeather.temp.max,
        min: dailyWeather.temp.min,
        icon: dailyWeather.weather[0].icon,
        pop: dailyWeather.pop,
        wind: dailyWeather.wind_speed,
        pressure: dailyWeather.pressure,
        humidity: dailyWeather.humidity,
        uvIndex: dailyWeather.uvi,
      });
    }

    setToggleComponent(!toggleComponent);
  };

  const fetchData = useRef(()=>{});

  fetchData.current = ()=>{
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' +
      props.route.params.city.coord.lat + '&lon=' +
      props.route.params.city.coord.lon + '&appid=e171929c9baccfd16eae065813feebff')
    .then((response) => response.json()).then((json) => {
      const hourlyArray = [], dailyArray = [];

      json.hourly.forEach((item, index)=>{
        hourlyArray.push({
          id: index,
          item: item,
        });
      });

      json.daily.forEach((item, index)=>{
        dailyArray.push({
          id: index,
          item: item,
        });
      });

      setWeatherData({
        wind: props.route.params.city.wind.speed,
        humidity: props.route.params.city.main.humidity,
        uvIndex: json.current.uvi,
        pressure: props.route.params.city.main.pressure,
        visibility: json.current.visibility,
        dewPoint: json.current.dew_point,
        hourly: hourlyArray,
        daily: dailyArray,
      });
    })
    .catch((error) => {
      console.error(error);
    });
  };

  useEffect(()=>{
    fetchData.current();
  }, [weatherData]);

  return (
    <View style={styles.viewContainer}>
      <SearchModal
        modalSearch={modalSearch.visible}
        closeModal={()=> closeModal()}
        goToCityDetails={goToCityDetails}
        {...props} />
      <View style={styles.viewCity}>
        <TouchableOpacity onPress={()=> goToSearch()}>
          <Icon name="search" size={50} color="black" />
        </TouchableOpacity>
        <Text style={styles.textCity}>{props.route.params.city.name}</Text>
        <Icon name="location" size={25} color="black" style={styles.viewIcon}/>
      </View>
      <View style={styles.viewIconDescription}>
        <Image source={{uri:`http://openweathermap.org/img/w/${props.route.params.city.weather[0].icon}.png`}} style={styles.logo} />
        <Text>{props.route.params.city.weather[0].description}</Text>
      </View>
      <Text style={styles.textTemperature}>{parseInt(props.route.params.city.main.temp + (-1 * 273.15)).toFixed(0)}°C</Text>
      <Text style={styles.textFeelsLike}>Feels like {parseInt(props.route.params.city.main.feels_like + (-1 * 273.15)).toFixed(0)}°C</Text>

      <View style={styles.viewMinMax}>
        <Text>Min {parseInt(props.route.params.city.main.temp_min + (-1 * 273.15)).toFixed(0)}°C    </Text>
        <Text>Max {parseInt(props.route.params.city.main.temp_max + (-1 * 273.15)).toFixed(0)}°C</Text>
      </View>
      <View style={styles.viewWeather}>
        <View style={styles.viewRow1}>
          <View style={styles.viewField1}><Text style={styles.textField}>Wind: {weatherData.wind}m/s</Text></View>
          <View style={styles.viewField1}><Text style={styles.textField}>Humidity: {weatherData.humidity}</Text></View>
          <View style={styles.viewField1}><Text style={styles.textField}>UV index: {weatherData.uvIndex}</Text></View>
        </View>
        <View style={styles.viewRow2}>
          <View style={styles.viewField1}><Text style={styles.textField}>Pressure: {parseInt(weatherData.pressure / 33.86).toFixed(2)}inHg</Text></View>
          <View style={styles.viewField1}><Text style={styles.textField}>Visibility: {weatherData.visibility / 1000}km</Text></View>
          <View style={styles.viewField1}><Text style={styles.textField}>Dew Point: {parseInt(weatherData.dewPoint + (-1 * 273.15)).toFixed(0)}°C</Text></View>
        </View>
      </View>
      <View style={styles.viewHourlyWeather}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={weatherData.hourly}
          renderItem={({item})=>{
            const time = new Date(item.item.dt * 1000);
            return (
              <View style={styles.viewHour}>
                <Text>{time.getHours()}{time.getHours() >= 12 ? 'pm' : 'am'}</Text>
                <Image source={{uri:`http://openweathermap.org/img/w/${item.item.weather[0].icon}.png`}} style={styles.miniLogo} />
                <Text>{parseInt(item.item.temp + (-1 * 273.15)).toFixed(0)}°C</Text>
              </View>
            );
          }}
          extraData={weatherData.hourly}
          keyExtractor={item => item.id.toString()}/>
      </View>
      {toggleComponent ?
        <View style={styles.viewDailyWeather}>
          <FlatList
            nestedScrollEnabled
            data={weatherData.daily}
            renderItem={({item})=>{
              const time = new Date(item.item.dt * 1000);
              return (
                <TouchableOpacity onPress={()=> changeComponent(item.item)} style={styles.viewDay}>
                  <View style={styles.viewDate}><Text>{time.toDateString().substring(0,9)}</Text></View>
                  <View style={styles.viewMaxMin}>
                    <Text style={styles.textMaxMin}>{parseInt(item.item.temp.max + (-1 * 273.15)).toFixed(0)} / {parseInt(item.item.temp.min + (-1 * 273.15)).toFixed(0)}°C</Text>
                  </View>
                  <Image source={{uri:`http://openweathermap.org/img/w/${item.item.weather[0].icon}.png`}} style={styles.miniLogo} />
                </TouchableOpacity>
              );
            }}
            extraData={weatherData.hourly}
            keyExtractor={item => item.id.toString()}/>
        </View> :
        <ScrollView style={styles.viewWeatherInformation}>
          <View style={styles.viewTopDayWeather}>
            <View><Text style={{fontWeight: 'bold'}}>{dayWeather.description}</Text></View>
            <Text style={styles.textMaxMin}>{parseInt(dayWeather.max + (-1 * 273.15)).toFixed(0)} / {parseInt(dayWeather.min + (-1 * 273.15)).toFixed(0)}°C</Text>
            <Image source={{uri:`http://openweathermap.org/img/w/${dayWeather.icon}.png`}} style={styles.miniLogo} />
            <TouchableOpacity onPress={()=> changeComponent(dayWeather)} style={styles.viewDay}>
              <Icon name="navicon" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.viewInformation}>
            <View style={styles.viewData}>
              <View style={styles.viewDayLabels}><Text>Probability of precipitation</Text></View>
              <Text>{dayWeather.pop}%</Text>
            </View>
            <View style={styles.viewData}>
              <View style={styles.viewDayLabels}><Text>Wind</Text></View>
              <Text>{dayWeather.wind}m/s SSW</Text>
            </View>
            <View style={styles.viewData}>
              <View style={styles.viewDayLabels}><Text>Pressure</Text></View>
              <Text>{parseInt(dayWeather.pressure / 33.86).toFixed(2)}inHg</Text>
            </View>
            <View style={styles.viewData}>
              <View style={styles.viewDayLabels}><Text>Humidity</Text></View>
              <Text>{dayWeather.humidity}%</Text>
            </View>
            <View style={styles.viewData}>
              <View style={styles.viewDayLabels}><Text>UV index</Text></View>
              <Text>{dayWeather.uvIndex}</Text>
            </View>
          </View>
        </ScrollView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  viewCity: {
    flexDirection: 'row',
    marginLeft: '10%',
    marginBottom: '0%',
    marginTop: 0,
    width: '100%',
  },
  logo: {
    width: 30,
    height: 30,
  },
  miniLogo: {
    width: 20,
    height: 30,
  },
  textCity: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  viewIcon: {
    marginTop: '1%',
    marginLeft: '1%',
  },
  viewIconDescription: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 140,
  },
  textTemperature: {
    color: 'black',
    fontSize: 45,
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  textFeelsLike: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Arial',
  },
  viewWeather: {
    marginTop: 20,
    marginBottom: 5,
    padding: 10,
    width: '100%',
    height: 70,
    backgroundColor: 'lightgray',
  },
  viewRow1: {
    flexDirection: 'row',
    height: '50%',
    width: '100%',
  },
  viewRow2: {
    flexDirection: 'row',
    height: '50%',
    width: '100%',
  },
  viewField1: {
    width: 115,
    marginRight: 5,
  },
  textField: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Arial',
  },
  viewMinMax: {
    flexDirection: 'row',
    marginTop: 5,
  },
  viewHourlyWeather: {
    width: '100%',
    height: 80,
  },
  viewHour: {
    width: 50,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDailyWeather: {
    flexDirection: 'column',
    width: '100%',
    height: 150,
  },
  viewDay: {
    flexDirection: 'row',
    marginLeft: 15,
    width: '100%',
    height: 30,
  },
  viewDate: {
    width: 70,
    marginLeft: 20,
    marginRight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMaxMin: {
    marginLeft: 90,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewMaxMin: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewInformation: {
    width: '100%',
  },
  viewData: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  viewWeatherInformation: {
    width: '100%',
    marginTop: 5,
    marginLeft: 20,
  },
  viewTopDayWeather: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
  },
  viewDayLabels: {
    width: 250,
  },
});

export default CityDetailsScreen;
